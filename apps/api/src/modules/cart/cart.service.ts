import db from '../../config/db';

export class CartService {
  /**
   * Obtiene o crea el carrito activo para un usuario, 
   * y carga sus ítems.
   */
  static async getCart(userId: string) {
    // 1. Obtener carrito
    let [carts]: any = await db.execute(
      `SELECT id, expires_at FROM carts WHERE user_id = ? AND expires_at > NOW()`,
      [userId]
    );

    let cartId = '';
    
    if (carts.length === 0) {
      // Eliminar carritos expirados anteriores
      await db.execute(`DELETE FROM carts WHERE user_id = ?`, [userId]);
      // Crear nuevo
      const [result]: any = await db.execute(
        `INSERT INTO carts (user_id) VALUES (?)`,
        [userId]
      );
      // Extraemos el id generado por el Trigger o UUID auto-insert. 
      // MySQL 8 con UUID default es un poco tricky devolver el string generado. 
      // Por suerte tenemos UNIQUE en user_id.
      let [newCart]: any = await db.execute(`SELECT id FROM carts WHERE user_id = ?`, [userId]);
      cartId = newCart[0].id;
    } else {
      cartId = carts[0].id;
    }

    // 2. Cargar ítems con detalles de producto
    const [items]: any = await db.execute(
      `SELECT ci.id, ci.cart_id, ci.product_id, ci.variant_id, ci.quantity, ci.unit_price,
              p.name AS product_name, p.slug, p.stock_alert_threshold,
              tt.rate AS tax_rate,
              pi.image_url AS primary_image,
              pv.name AS variant_name, pv.stock AS variant_stock,
              (SELECT COALESCE(SUM(v2.stock), 0) FROM product_variants v2 WHERE v2.product_id = p.id AND v2.is_active = 1) AS total_stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       LEFT JOIN tax_types tt ON tt.id = p.tax_type_id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
       LEFT JOIN product_variants pv ON pv.id = ci.variant_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    let subtotal = 0;
    let tax_amount = 0;

    const formattedItems = items.map((item: any) => {
      const stockAvailable = item.variant_id ? item.variant_stock : item.total_stock;
      const exceedsStock = item.quantity > stockAvailable;
      
      const itemSubtotal = item.quantity * item.unit_price;
      const itemTax = itemSubtotal * (item.tax_rate || 0);

      subtotal += itemSubtotal;
      tax_amount += itemTax;

      return {
        ...item,
        stock_available: stockAvailable,
        stock_exceeded: exceedsStock,
        item_subtotal: Number(itemSubtotal.toFixed(2)),
      };
    });

    const total = subtotal + tax_amount;

    return {
      cart_id: cartId,
      items: formattedItems,
      summary: {
        subtotal: Number(subtotal.toFixed(2)),
        tax_amount: Number(tax_amount.toFixed(2)),
        total: Number(total.toFixed(2))
      }
    };
  }

  /**
   * Añadir un producto al carrito
   */
  static async addItem(userId: string, productId: string, variantId: string | null, quantity: number) {
    const cartData = await this.getCart(userId);
    const cartId = cartData.cart_id;

    // Verificar stock base
    const [products]: any = await db.execute(
      `SELECT p.id, ROUND(p.base_price * (1 - p.discount_percent / 100), 2) AS final_price,
              (SELECT COALESCE(SUM(pv.stock), 0) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) AS total_stock
       FROM products p WHERE p.id = ? AND p.is_active = 1`,
      [productId]
    );

    if (!products.length) throw new Error('NOT_FOUND|Producto no existe o está inactivo');
    const product = products[0];

    let queryPrice = product.final_price;
    let availableStock = product.total_stock;

    if (variantId) {
      const [variants]: any = await db.execute(
        `SELECT stock, price_override FROM product_variants WHERE id = ? AND product_id = ? AND is_active = 1`,
        [variantId, productId]
      );
      if (!variants.length) throw new Error('NOT_FOUND|Variante no existe');
      
      availableStock = variants[0].stock;
      if (variants[0].price_override !== null) {
        queryPrice = variants[0].price_override;
      }
    }

    // Verificar si ya existe en el carrito para sumar la cantidad
    const existingItem = variantId
      ? cartData.items.find((i: any) => i.product_id === productId && i.variant_id === variantId)
      : cartData.items.find((i: any) => i.product_id === productId && i.variant_id === null);

    const targetQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (targetQuantity > availableStock) {
      throw new Error(`STOCK_EXCEEDED|Stock insuficiente. Disponible: ${availableStock}`);
    }

    if (existingItem) {
      await db.execute(
        `UPDATE cart_items SET quantity = ?, unit_price = ? WHERE id = ?`,
        [targetQuantity, queryPrice, existingItem.id]
      );
    } else {
      await db.execute(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?)`,
        [cartId, productId, variantId, targetQuantity, queryPrice]
      );
    }

    return this.getCart(userId);
  }

  /**
   * Actualiza la cantidad exacta de un ítem existente
   */
  static async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    // Validar si el item es de este usuario
    const cartData = await this.getCart(userId);
    const existingItem = cartData.items.find((i: any) => i.id === itemId);
    
    if (!existingItem) throw new Error('NOT_FOUND|Ítem no encontrado en el carrito');

    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    if (quantity > existingItem.stock_available) {
      throw new Error(`STOCK_EXCEEDED|Stock insuficiente. Disponible: ${existingItem.stock_available}`);
    }

    await db.execute(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [quantity, itemId]);
    return this.getCart(userId);
  }

  /**
   * Eliminar un ítem
   */
  static async removeItem(userId: string, itemId: string) {
    const cartData = await this.getCart(userId);
    const existingItem = cartData.items.find((i: any) => i.id === itemId);
    if (!existingItem) throw new Error('NOT_FOUND|Ítem no encontrado en el carrito');

    await db.execute(`DELETE FROM cart_items WHERE id = ?`, [itemId]);
    return this.getCart(userId);
  }
}
