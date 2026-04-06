import db from '../../config/db';

export class WishlistService {
  /**
   * Obtiene o crea el wishlist del usuario y retorna items populados
   */
  static async getWishlist(userId: string) {
    // Asegurar que existe el wishlist maestro
    let [wishlists]: any = await db.execute(
      `SELECT id FROM wishlists WHERE user_id = ?`, [userId]
    );

    let wishlistId: string;
    if (wishlists.length === 0) {
      await db.execute(`INSERT INTO wishlists (user_id) VALUES (?)`, [userId]);
      const [created]: any = await db.execute(`SELECT id FROM wishlists WHERE user_id = ?`, [userId]);
      wishlistId = created[0].id;
    } else {
      wishlistId = wishlists[0].id;
    }

    // Traer items con datos del producto
    const [items]: any = await db.execute(
      `SELECT 
         wi.id AS wishlist_item_id,
         wi.added_at,
         p.id AS product_id,
         p.name, p.slug, p.base_price, p.discount_percent,
         ROUND(p.base_price * (1 - p.discount_percent / 100), 2) AS final_price,
         (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image,
         (SELECT COALESCE(SUM(pv.stock), 0) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) AS total_stock
       FROM wishlist_items wi
       JOIN products p ON p.id = wi.product_id
       WHERE wi.wishlist_id = ?
       ORDER BY wi.added_at DESC`,
      [wishlistId]
    );

    return { wishlist_id: wishlistId, items };
  }

  /**
   * Retorna solo los product_ids en el wishlist (para checks rápidos en frontend)
   */
  static async getWishlistIds(userId: string) {
    let [wishlists]: any = await db.execute(
      `SELECT id FROM wishlists WHERE user_id = ?`, [userId]
    );
    if (wishlists.length === 0) return [];

    const [items]: any = await db.execute(
      `SELECT product_id FROM wishlist_items WHERE wishlist_id = ?`,
      [wishlists[0].id]
    );
    return items.map((i: any) => i.product_id);
  }

  /**
   * Agrega un producto al wishlist
   */
  static async addItem(userId: string, productId: string) {
    // Asegurar wishlist
    let [wishlists]: any = await db.execute(
      `SELECT id FROM wishlists WHERE user_id = ?`, [userId]
    );

    let wishlistId: string;
    if (wishlists.length === 0) {
      await db.execute(`INSERT INTO wishlists (user_id) VALUES (?)`, [userId]);
      const [created]: any = await db.execute(`SELECT id FROM wishlists WHERE user_id = ?`, [userId]);
      wishlistId = created[0].id;
    } else {
      wishlistId = wishlists[0].id;
    }

    // Verificar que el producto existe
    const [products]: any = await db.execute(`SELECT id FROM products WHERE id = ?`, [productId]);
    if (products.length === 0) throw new Error('NOT_FOUND|Producto no encontrado');

    // Insertar (ignorar duplicado)
    try {
      await db.execute(
        `INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)`,
        [wishlistId, productId]
      );
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        // Ya existe, no es error
      } else {
        throw e;
      }
    }

    return this.getWishlist(userId);
  }

  /**
   * Remueve un producto del wishlist
   */
  static async removeItem(userId: string, productId: string) {
    const [wishlists]: any = await db.execute(
      `SELECT id FROM wishlists WHERE user_id = ?`, [userId]
    );
    if (wishlists.length === 0) throw new Error('NOT_FOUND|Wishlist no encontrado');

    await db.execute(
      `DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?`,
      [wishlists[0].id, productId]
    );

    return this.getWishlist(userId);
  }
}
