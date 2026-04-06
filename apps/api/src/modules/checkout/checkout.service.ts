import db from '../../config/db';
import { RowDataPacket, OkPacket } from 'mysql2/promise';

export class CheckoutService {
  /**
   * Obtiene zonas de envío activas
   */
  static async getShippingZones() {
    const [rows]: any = await db.execute(`SELECT * FROM shipping_zones WHERE is_active = 1`);
    return rows;
  }

  /**
   * Ejecuta el checkout en una única TRASACCIÓN MySQL (Regla 5 AGENT.md)
   */
  static async createOrder(userId: string, data: { shippingAddressId: string, shippingZoneId: string, paymentMethod: string, notes?: string }) {
    // 1. Extraer conexión limpia del pool para manejar la transacción de forma exclusiva
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Obtener carrito
      const [carts]: any = await connection.execute(
        `SELECT id, expires_at FROM carts WHERE user_id = ? AND expires_at > NOW() FOR UPDATE`,
        [userId]
      );
      if (carts.length === 0) throw new Error('CONFLICT|El carrito no existe o expiró');
      const cartId = carts[0].id;

      // 2. Traer items del carrito
      const [items]: any = await connection.execute(
        `SELECT ci.id, ci.product_id, ci.variant_id, ci.quantity, ci.unit_price,
                p.base_price, p.discount_percent, p.weight_kg,
                tt.rate AS tax_rate,
                pv.stock AS variant_stock,
                (SELECT COALESCE(SUM(v2.stock), 0) FROM product_variants v2 WHERE v2.product_id = p.id AND v2.is_active = 1) AS total_stock
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         LEFT JOIN tax_types tt ON tt.id = p.tax_type_id
         LEFT JOIN product_variants pv ON pv.id = ci.variant_id
         WHERE ci.cart_id = ? FOR UPDATE`,
        [cartId]
      );

      if (items.length === 0) throw new Error('CONFLICT|El carrito está vacío');

      // Calcular Peso Total, Subtotales e Impuestos (Reglas 3 y 4 de AGENT.md)
      let subtotal = 0;
      let tax_amount = 0;
      let total_weight = 0;

      for (const item of items) {
        // Verificar stock de cada variante (Regla 2: Error 409 si falta stock)
        const stockAvailable = item.variant_id ? item.variant_stock : item.total_stock;
        if (item.quantity > stockAvailable) {
          throw new Error(`CONFLICT|Stock insuficiente para un producto en el carrito (Disp: ${stockAvailable}, Solicitado: ${item.quantity})`);
        }

        const itemSubtotal = item.quantity * item.unit_price;
        const itemTax = itemSubtotal * (item.tax_rate || 0);

        subtotal += itemSubtotal;
        tax_amount += itemTax;
        total_weight += (item.weight_kg * item.quantity);
      }

      // 3. Calcular shipping_cost (Regla 3)
      const [zones]: any = await connection.execute(`SELECT base_price, price_per_kg FROM shipping_zones WHERE id = ?`, [data.shippingZoneId]);
      if (zones.length === 0) throw new Error('NOT_FOUND|Zona de envío inválida');
      
      const zoneInfo = zones[0];
      const shipping_cost = Number(zoneInfo.base_price) + (total_weight * Number(zoneInfo.price_per_kg));

      // 5. Calcular total definitivo
      const total = subtotal + shipping_cost + tax_amount;

      // 6. Generar número de orden (Simple formato K-TS)
      const orderNumber = `K-${Date.now().toString().slice(-6)}`;
      const paymentStatus = ['TARJETA', 'PAYPHONE'].includes(data.paymentMethod) ? 'CONFIRMADO' : 'PENDIENTE';
      const orderStatus = paymentStatus === 'CONFIRMADO' ? 'PAGO_CONFIRMADO' : 'PENDIENTE_PAGO';

      // 6.1 INSERT en orders
      const [orderResult] = await connection.execute<OkPacket>(
        `INSERT INTO orders (user_id, order_number, status, subtotal, shipping_cost, tax_amount, total, payment_method, payment_status, shipping_address_id, shipping_zone_id, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, orderNumber, orderStatus, subtotal, shipping_cost, tax_amount, total, data.paymentMethod, paymentStatus, data.shippingAddressId, data.shippingZoneId, data.notes || null]
      );
      
      // En MySQL 8 podemos usar uuid(), no tenemos un ID numérico insertId si la tabla orders no es AUTO_INCREMENT, es CHAR(36).
      // PERO, OJO: El UUID() en tabla orders se asigna por DEFAULT. Para recuperarlo rápido sin AUTO_INCREMENT:
      const [newOrder]: any = await connection.execute(`SELECT id FROM orders WHERE order_number = ?`, [orderNumber]);
      const orderId = newOrder[0].id;

      // 6.2 INSERT en order_items y 7. UPDATE product_variants (Stock Resta)
      for (const item of items) {
        const itemSubtotal = item.quantity * item.unit_price;
        
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price, tax_rate, discount_percent, subtotal)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.variant_id, item.quantity, item.unit_price, item.tax_rate || 0, item.discount_percent, itemSubtotal]
        );

        if (item.variant_id) {
          await connection.execute(
            `UPDATE product_variants SET stock = stock - ? WHERE id = ?`,
            [item.quantity, item.variant_id]
          );
        }
      }

      // 8. DELETE de cart_items (Vaciar Carrito) 
      // Por cascade, si borramos el carrito se limpia, o borramos items individualmente.
      await connection.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);

      // 9. COMMIT
      await connection.commit();
      
      // 10. Retornar
      return { order_id: orderId, order_number: orderNumber, total, status: orderStatus };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
