import db from '../../config/db';

export class OrdersService {
  /**
   * Historial de pedidos del usuario, resumen rápido
   */
  static async getUserOrders(userId: string) {
    const [orders]: any = await db.execute(
      `SELECT 
         o.id, o.order_number, o.status, o.payment_method, o.payment_status,
         o.subtotal, o.shipping_cost, o.tax_amount, o.total,
         o.created_at, o.updated_at,
         sz.name AS shipping_zone_name,
         (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS items_count
       FROM orders o
       LEFT JOIN shipping_zones sz ON sz.id = o.shipping_zone_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return orders;
  }

  /**
   * Detalle profundo de un pedido individual con items, dirección e historial
   */
  static async getOrderDetail(userId: string, orderId: string) {
    // 1. Orden principal
    const [orders]: any = await db.execute(
      `SELECT 
         o.*,
         sz.name AS shipping_zone_name,
         ua.label AS address_label, ua.street AS address_street,
         ua.city AS address_city, ua.province AS address_province
       FROM orders o
       LEFT JOIN shipping_zones sz ON sz.id = o.shipping_zone_id
       LEFT JOIN user_addresses ua ON ua.id = o.shipping_address_id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) return null;
    const order = orders[0];

    // 2. Ítems del pedido (con nombre de producto e imagen)
    const [items]: any = await db.execute(
      `SELECT 
         oi.id, oi.quantity, oi.unit_price, oi.tax_rate, oi.discount_percent, oi.subtotal,
         p.name AS product_name, p.slug AS product_slug,
         pv.name AS variant_name,
         (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       LEFT JOIN product_variants pv ON pv.id = oi.variant_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // 3. Historial de cambios de estado (Timeline)
    const [history]: any = await db.execute(
      `SELECT id, status, notes, created_at
       FROM order_status_history
       WHERE order_id = ?
       ORDER BY created_at ASC`,
      [orderId]
    );

    return { ...order, items, status_history: history };
  }
}
