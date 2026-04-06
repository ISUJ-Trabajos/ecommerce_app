import db from '../../config/db';

export class CatalogService {
  // ── Categories ──────────────────────────────────────────────
  static async getCategories() {
    const [rows]: any = await db.execute(
      `SELECT id, parent_id, name, slug, image_url, sort_order
       FROM categories WHERE is_active = 1
       ORDER BY sort_order ASC`
    );
    return rows;
  }

  // ── Featured products (Home) ────────────────────────────────
  static async getFeatured() {
    const [featured]: any = await db.execute(
      `SELECT p.*, 
              pi.image_url AS primary_image,
              ROUND(p.base_price * (1 - p.discount_percent / 100), 2) AS final_price,
              (SELECT COALESCE(SUM(pv.stock), 0) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) AS total_stock
       FROM products p
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
       WHERE p.is_active = 1 AND p.is_featured = 1
       ORDER BY p.created_at DESC
       LIMIT 10`
    );

    const [bestsellers]: any = await db.execute(
      `SELECT p.*, 
              pi.image_url AS primary_image,
              ROUND(p.base_price * (1 - p.discount_percent / 100), 2) AS final_price,
              (SELECT COALESCE(SUM(pv.stock), 0) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) AS total_stock
       FROM products p
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
       WHERE p.is_active = 1 AND p.is_bestseller = 1
       ORDER BY p.created_at DESC
       LIMIT 10`
    );

    return { featured, bestsellers };
  }

  // ── Product list (paginated + filters) ──────────────────────
  static async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    let where = 'WHERE p.is_active = 1';
    const values: any[] = [];

    if (params.category) {
      where += ` AND EXISTS (SELECT 1 FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = p.id AND c.slug = ?)`;
      values.push(params.category);
    }

    if (params.search) {
      where += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      values.push(`%${params.search}%`, `%${params.search}%`);
    }

    if (params.min_price) {
      where += ` AND ROUND(p.base_price * (1 - p.discount_percent / 100), 2) >= ?`;
      values.push(params.min_price);
    }

    if (params.max_price) {
      where += ` AND ROUND(p.base_price * (1 - p.discount_percent / 100), 2) <= ?`;
      values.push(params.max_price);
    }

    let orderBy = 'ORDER BY p.created_at DESC';
    if (params.sort === 'price_asc') orderBy = 'ORDER BY final_price ASC';
    else if (params.sort === 'price_desc') orderBy = 'ORDER BY final_price DESC';
    else if (params.sort === 'name') orderBy = 'ORDER BY p.name ASC';

    // Count total
    const [countRows]: any = await db.execute(
      `SELECT COUNT(*) as total FROM products p ${where}`,
      values
    );
    const total = countRows[0].total;

    // Get products
    const [rows]: any = await db.execute(
      `SELECT p.*,
              pi.image_url AS primary_image,
              ROUND(p.base_price * (1 - p.discount_percent / 100), 2) AS final_price,
              (SELECT COALESCE(SUM(pv.stock), 0) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) AS total_stock
       FROM products p
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
       ${where}
       ${orderBy}
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    return {
      products: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // ── Single product by slug ──────────────────────────────────
  static async getProductBySlug(slug: string) {
    const [products]: any = await db.execute(
      `SELECT p.*,
              ROUND(p.base_price * (1 - p.discount_percent / 100), 2) AS final_price,
              (SELECT COALESCE(SUM(pv.stock), 0) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) AS total_stock,
              tt.name AS tax_name, tt.rate AS tax_rate
       FROM products p
       LEFT JOIN tax_types tt ON tt.id = p.tax_type_id
       WHERE p.slug = ? AND p.is_active = 1`,
      [slug]
    );

    if (!products.length) return null;
    const product = products[0];

    // Get images
    const [images]: any = await db.execute(
      `SELECT id, image_url, sort_order, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`,
      [product.id]
    );

    // Get variants
    const [variants]: any = await db.execute(
      `SELECT id, name, sku, stock, price_override, is_active FROM product_variants WHERE product_id = ? AND is_active = 1`,
      [product.id]
    );

    // Get categories
    const [categories]: any = await db.execute(
      `SELECT c.id, c.name, c.slug FROM categories c
       JOIN product_categories pc ON pc.category_id = c.id
       WHERE pc.product_id = ?`,
      [product.id]
    );

    // Get related products (same categories)
    const [related]: any = await db.execute(
      `SELECT DISTINCT p2.id, p2.name, p2.slug, p2.base_price, p2.discount_percent,
              ROUND(p2.base_price * (1 - p2.discount_percent / 100), 2) AS final_price,
              pi2.image_url AS primary_image
       FROM products p2
       JOIN product_categories pc2 ON pc2.product_id = p2.id
       LEFT JOIN product_images pi2 ON pi2.product_id = p2.id AND pi2.is_primary = 1
       WHERE pc2.category_id IN (SELECT pc3.category_id FROM product_categories pc3 WHERE pc3.product_id = ?)
         AND p2.id != ? AND p2.is_active = 1
       LIMIT 6`,
      [product.id, product.id]
    );

    return { ...product, images, variants, categories, related };
  }
}
