-- =============================================================
-- KUMAR STORE — Script SQL Prototipo Local
-- Motor: MySQL 8.0 (XAMPP / phpMyAdmin)
-- Versión: PROTO-1.0 | Abril 2026
-- Nota: Versión simplificada para prototipo local
-- =============================================================

DROP DATABASE IF EXISTS kumar_store_proto;
CREATE DATABASE kumar_store_proto
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kumar_store_proto;

-- =============================================================
-- 1. TABLAS DE USUARIOS Y AUTENTICACIÓN
-- =============================================================

CREATE TABLE users (
  id               CHAR(36)      NOT NULL DEFAULT (UUID()),
  email            VARCHAR(255)  NOT NULL UNIQUE,
  password_hash    VARCHAR(255)  NOT NULL,
  full_name        VARCHAR(255)  NOT NULL,
  birth_date       DATE          NOT NULL,
  phone            VARCHAR(20)   NOT NULL,
  role             ENUM('CLIENTE','ADMIN') NOT NULL DEFAULT 'CLIENTE',
  status           ENUM('ACTIVO','BLOQUEADO_TEMP','BLOQUEADO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  dark_mode        TINYINT(1)    NOT NULL DEFAULT 1,
  splash_anim      TINYINT(1)    NOT NULL DEFAULT 1,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE user_addresses (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id      CHAR(36)     NOT NULL,
  label        VARCHAR(100) NOT NULL DEFAULT 'Casa',
  street       VARCHAR(500) NOT NULL,
  city         VARCHAR(100) NOT NULL,
  province     VARCHAR(100) NOT NULL DEFAULT 'Pichincha',
  postal_code  VARCHAR(20),
  is_default   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE login_attempts (
  id                     CHAR(36)     NOT NULL DEFAULT (UUID()),
  email                  VARCHAR(255) NOT NULL,
  user_id                CHAR(36),
  attempts_today         INT          NOT NULL DEFAULT 0,
  blocks_today           INT          NOT NULL DEFAULT 0,
  blocked_until          DATETIME,
  is_permanently_blocked TINYINT(1)   NOT NULL DEFAULT 0,
  last_ip                VARCHAR(45),
  updated_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_login_email (email),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sessions (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id       CHAR(36)     NOT NULL,
  refresh_token VARCHAR(500) NOT NULL UNIQUE,
  device_info   VARCHAR(500),
  ip_address    VARCHAR(45),
  expires_at    DATETIME     NOT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
-- 2. CATÁLOGO
-- =============================================================

CREATE TABLE tax_types (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(100) NOT NULL,
  rate        DECIMAL(5,4) NOT NULL DEFAULT 0.1500,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  parent_id   CHAR(36),
  name        VARCHAR(150) NOT NULL,
  slug        VARCHAR(200) NOT NULL UNIQUE,
  image_url   VARCHAR(500),
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE tags (
  id    CHAR(36)     NOT NULL DEFAULT (UUID()),
  name  VARCHAR(100) NOT NULL,
  slug  VARCHAR(150) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE products (
  id                     CHAR(36)      NOT NULL DEFAULT (UUID()),
  name                   VARCHAR(300)  NOT NULL,
  slug                   VARCHAR(350)  NOT NULL UNIQUE,
  description            TEXT,
  sku                    VARCHAR(100)  NOT NULL UNIQUE,
  base_price             DECIMAL(10,2) NOT NULL,
  discount_percent       DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  weight_kg              DECIMAL(8,3)  NOT NULL DEFAULT 0.500,
  stock_alert_threshold  INT           NOT NULL DEFAULT 5,
  is_featured            TINYINT(1)    NOT NULL DEFAULT 0,
  is_bestseller          TINYINT(1)    NOT NULL DEFAULT 0,
  is_active              TINYINT(1)    NOT NULL DEFAULT 1,
  tax_type_id            CHAR(36),
  created_at             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (tax_type_id) REFERENCES tax_types(id)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  product_id     CHAR(36)     NOT NULL,
  image_url      VARCHAR(500) NOT NULL,
  cloudinary_id  VARCHAR(200),
  sort_order     INT          NOT NULL DEFAULT 0,
  is_primary     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  product_id     CHAR(36)      NOT NULL,
  name           VARCHAR(200)  NOT NULL,
  sku            VARCHAR(100)  NOT NULL UNIQUE,
  stock          INT           NOT NULL DEFAULT 0,
  price_override DECIMAL(10,2),
  is_active      TINYINT(1)    NOT NULL DEFAULT 1,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_categories (
  product_id   CHAR(36) NOT NULL,
  category_id  CHAR(36) NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id)  REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_tags (
  product_id  CHAR(36) NOT NULL,
  tag_id      CHAR(36) NOT NULL,
  PRIMARY KEY (product_id, tag_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)     REFERENCES tags(id)     ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
-- 3. CARRITO Y WISHLIST
-- =============================================================

CREATE TABLE carts (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id     CHAR(36)  NOT NULL UNIQUE,
  expires_at  DATETIME  NOT NULL DEFAULT (DATE_ADD(NOW(), INTERVAL 7 DAY)),
  created_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id          CHAR(36)      NOT NULL DEFAULT (UUID()),
  cart_id     CHAR(36)      NOT NULL,
  product_id  CHAR(36)      NOT NULL,
  variant_id  CHAR(36),
  quantity    INT           NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,2) NOT NULL,
  added_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_item (cart_id, product_id, variant_id),
  FOREIGN KEY (cart_id)    REFERENCES carts(id)            ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)         ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE wishlists (
  id         CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id    CHAR(36)  NOT NULL UNIQUE,
  created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wishlist_items (
  id           CHAR(36)  NOT NULL DEFAULT (UUID()),
  wishlist_id  CHAR(36)  NOT NULL,
  product_id   CHAR(36)  NOT NULL,
  added_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist_item (wishlist_id, product_id),
  FOREIGN KEY (wishlist_id) REFERENCES wishlists(id)  ON DELETE CASCADE,
  FOREIGN KEY (product_id)  REFERENCES products(id)   ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
-- 4. PEDIDOS Y PAGOS
-- =============================================================

CREATE TABLE shipping_zones (
  id            CHAR(36)      NOT NULL DEFAULT (UUID()),
  name          VARCHAR(200)  NOT NULL,
  province      VARCHAR(100)  NOT NULL,
  base_price    DECIMAL(10,2) NOT NULL DEFAULT 2.00,
  price_per_kg  DECIMAL(10,2) NOT NULL DEFAULT 0.50,
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id                  CHAR(36)       NOT NULL DEFAULT (UUID()),
  user_id             CHAR(36)       NOT NULL,
  order_number        VARCHAR(30)    NOT NULL UNIQUE,
  status              ENUM('PENDIENTE_PAGO','PAGO_CONFIRMADO','ENVIADO','EN_CAMINO','ENTREGADO','CANCELADO','DEVUELTO')
                      NOT NULL DEFAULT 'PENDIENTE_PAGO',
  subtotal            DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  shipping_cost       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  tax_amount          DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  total               DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  payment_method      ENUM('TARJETA','TRANSFERENCIA','CONTRA_ENTREGA','PAYPHONE') NOT NULL,
  payment_status      ENUM('PENDIENTE','CONFIRMADO','FALLIDO','REEMBOLSADO') NOT NULL DEFAULT 'PENDIENTE',
  shipping_address_id CHAR(36)       NOT NULL,
  shipping_zone_id    CHAR(36),
  notes               TEXT,
  created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id)             REFERENCES users(id)          ON DELETE RESTRICT,
  FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id) ON DELETE RESTRICT,
  FOREIGN KEY (shipping_zone_id)    REFERENCES shipping_zones(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id               CHAR(36)      NOT NULL DEFAULT (UUID()),
  order_id         CHAR(36)      NOT NULL,
  product_id       CHAR(36)      NOT NULL,
  variant_id       CHAR(36),
  quantity         INT           NOT NULL,
  unit_price       DECIMAL(10,2) NOT NULL,
  tax_rate         DECIMAL(5,4)  NOT NULL DEFAULT 0.1500,
  discount_percent DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  subtotal         DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id)   REFERENCES orders(id)           ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)         ON DELETE RESTRICT,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE order_status_history (
  id          CHAR(36)   NOT NULL DEFAULT (UUID()),
  order_id    CHAR(36)   NOT NULL,
  status      ENUM('PENDIENTE_PAGO','PAGO_CONFIRMADO','ENVIADO','EN_CAMINO','ENTREGADO','CANCELADO','DEVUELTO') NOT NULL,
  changed_by  CHAR(36),
  notes       TEXT,
  created_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- 5. RESEÑAS, FAQ Y AUDITORÍA
-- =============================================================

CREATE TABLE product_reviews (
  id                   CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id              CHAR(36)  NOT NULL,
  product_id           CHAR(36)  NOT NULL,
  order_id             CHAR(36)  NOT NULL,
  rating               TINYINT   NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment              TEXT,
  is_verified_purchase TINYINT(1) NOT NULL DEFAULT 1,
  is_visible           TINYINT(1) NOT NULL DEFAULT 1,
  created_at           DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_product_review (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE faq_categories (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  name       VARCHAR(150) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE faqs (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  category_id CHAR(36)  NOT NULL,
  question    TEXT      NOT NULL,
  answer      TEXT      NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT        NOT NULL DEFAULT 0,
  created_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE audit_log (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id      CHAR(36),
  action       VARCHAR(50)  NOT NULL,
  entity_type  VARCHAR(50)  NOT NULL,
  entity_id    VARCHAR(100),
  old_value    JSON,
  new_value    JSON,
  ip_address   VARCHAR(45),
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- 6. ÍNDICES
-- =============================================================

CREATE INDEX idx_products_active    ON products(is_active, is_featured);
CREATE INDEX idx_products_price     ON products(base_price, discount_percent);
CREATE INDEX idx_products_name      ON products(name);
CREATE INDEX idx_orders_user        ON orders(user_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_orders_number      ON orders(order_number);
CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_sessions_user      ON sessions(user_id);
CREATE INDEX idx_login_email        ON login_attempts(email);
CREATE INDEX idx_audit_entity       ON audit_log(entity_type, entity_id);

-- =============================================================
-- 7. TRIGGERS
-- =============================================================

DELIMITER $$

-- Trigger: registrar historial de estado al actualizar pedido
CREATE TRIGGER trg_order_status_history
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status THEN
    INSERT INTO order_status_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Cambio automático de estado');
  END IF;
END$$

-- Trigger: extender expiración del carrito al agregar ítem
CREATE TRIGGER trg_cart_extend_on_add
AFTER INSERT ON cart_items
FOR EACH ROW
BEGIN
  UPDATE carts
  SET expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY)
  WHERE id = NEW.cart_id;
END$$

-- Trigger: extender expiración al modificar ítem
CREATE TRIGGER trg_cart_extend_on_update
AFTER UPDATE ON cart_items
FOR EACH ROW
BEGIN
  UPDATE carts
  SET expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY)
  WHERE id = NEW.cart_id;
END$$

DELIMITER ;

-- =============================================================
-- 8. DATOS SEMILLA
-- =============================================================

-- Tipos de impuesto (Ecuador SRI 2026)
INSERT INTO tax_types (id, name, rate) VALUES
  (UUID(), 'IVA 15%',   0.1500),
  (UUID(), 'IVA 5%',    0.0500),
  (UUID(), 'Exento IVA',0.0000);

-- Categorías principales
SET @cat_moda    = UUID();
SET @cat_cosme   = UUID();
SET @cat_hogar   = UUID();
SET @cat_acces   = UUID();

INSERT INTO categories (id, name, slug, sort_order) VALUES
  (@cat_moda,  'Moda',                 'moda',              1),
  (@cat_cosme, 'Cosméticos y Salud',   'cosmeticos-salud',  2),
  (@cat_hogar, 'Hogar y Decoración',   'hogar-decoracion',  3),
  (@cat_acces, 'Accesorios',           'accesorios',        4);

-- Zonas de envío iniciales (Quito)
INSERT INTO shipping_zones (id, name, province, base_price, price_per_kg) VALUES
  (UUID(), 'Quito - Norte',             'Pichincha', 2.00, 0.50),
  (UUID(), 'Quito - Sur',               'Pichincha', 2.00, 0.50),
  (UUID(), 'Quito - Centro',            'Pichincha', 2.00, 0.50),
  (UUID(), 'Quito - Valle de los Chillos','Pichincha', 3.50, 0.75),
  (UUID(), 'Resto de Pichincha',        'Pichincha', 5.00, 1.00),
  (UUID(), 'Nacional',                  'Nacional',  10.00, 2.00);

-- Etiquetas base
INSERT INTO tags (id, name, slug) VALUES
  (UUID(), 'Nuevo',     'nuevo'),
  (UUID(), 'Popular',   'popular'),
  (UUID(), 'Oferta',    'oferta'),
  (UUID(), 'Exclusivo', 'exclusivo');

-- FAQ Categorías
SET @faq_cat1 = UUID();
SET @faq_cat2 = UUID();

INSERT INTO faq_categories (id, name, sort_order) VALUES
  (@faq_cat1, 'Pedidos y Envíos', 1),
  (@faq_cat2, 'Pagos',            2);

INSERT INTO faqs (id, category_id, question, answer, sort_order) VALUES
  (UUID(), @faq_cat1, '¿Cuánto tarda mi pedido?', 'Los pedidos dentro de Quito se entregan en 1-3 días hábiles.', 1),
  (UUID(), @faq_cat1, '¿Puedo rastrear mi pedido?', 'Sí, recibirás actualizaciones por email en cada cambio de estado.', 2),
  (UUID(), @faq_cat2, '¿Qué métodos de pago aceptan?', 'Aceptamos tarjeta, transferencia bancaria, contra entrega y Payphone.', 1);

-- =============================================================
-- 9. USUARIO ADMIN Y CLIENTE DE PRUEBA
-- =============================================================
-- Contraseña admin: Admin2026!  (hash bcrypt generado externamente)
-- Contraseña cliente: Cliente2026!

INSERT INTO users (id, email, password_hash, full_name, birth_date, phone, role, status) VALUES
  (UUID(),
   'admin@kumarstore.com',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMRJGjXCJuAJPX/x8kJ8bLpVGe',
   'Administrador KUMAR',
   '1990-01-01',
   '0999999999',
   'ADMIN',
   'ACTIVO'),
  (UUID(),
   'cliente@kumarstore.com',
   '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uFDFi9HXC',
   'Cliente de Prueba',
   '1995-06-15',
   '0988888888',
   'CLIENTE',
   'ACTIVO');

-- Dirección del cliente de prueba
INSERT INTO user_addresses (id, user_id, label, street, city, province, is_default)
SELECT UUID(), u.id, 'Casa', 'Av. Amazonas N34-180 y Atahualpa', 'Quito', 'Pichincha', 1
FROM users u WHERE u.email = 'cliente@kumarstore.com';

-- Carrito y wishlist para cliente de prueba
INSERT INTO carts (id, user_id)
SELECT UUID(), u.id FROM users u WHERE u.email = 'cliente@kumarstore.com';

INSERT INTO wishlists (id, user_id)
SELECT UUID(), u.id FROM users u WHERE u.email = 'cliente@kumarstore.com';

-- =============================================================
-- 10. PRODUCTOS DE DEMOSTRACIÓN
-- =============================================================

SET @tax_iva15 = (SELECT id FROM tax_types WHERE name = 'IVA 15%' LIMIT 1);

SET @prod1 = UUID(); SET @prod2 = UUID();
SET @prod3 = UUID(); SET @prod4 = UUID();
SET @prod5 = UUID(); SET @prod6 = UUID();

INSERT INTO products
  (id, name, slug, description, sku, base_price, discount_percent, weight_kg, stock_alert_threshold, is_featured, is_bestseller, is_active, tax_type_id)
VALUES
  (@prod1, 'Bolso de Cuero Sintético Negro', 'bolso-cuero-sintetico-negro',
   'Elegante bolso de cuero sintético, ideal para uso diario. Compartimentos organizados y correa ajustable.',
   'ACCS-001', 45.99, 10.00, 0.800, 5, 1, 1, 1, @tax_iva15),

  (@prod2, 'Camisa Slim Fit Azul Marino', 'camisa-slim-fit-azul',
   'Camisa de corte slim fit en algodón premium. Perfecta para ocasiones formales e informales.',
   'MODA-001', 29.99, 0.00, 0.300, 3, 0, 1, 1, @tax_iva15),

  (@prod3, 'Set Cremas Hidratantes Premium', 'set-cremas-hidratantes',
   'Kit completo de hidratación con crema facial, corporal y contorno de ojos. Ingredientes naturales.',
   'COSM-001', 38.50, 15.00, 0.600, 5, 1, 0, 1, @tax_iva15),

  (@prod4, 'Cojín Decorativo Geométrico', 'cojin-decorativo-geometrico',
   'Cojín con diseño geométrico moderno, relleno hipoalergénico. Medidas: 45x45cm.',
   'HOGA-001', 18.99, 0.00, 0.500, 4, 0, 0, 1, @tax_iva15),

  (@prod5, 'Reloj Minimalista Plateado', 'reloj-minimalista-plateado',
   'Reloj de pulsera con diseño minimalista, correa de acero inoxidable y vidrio mineral.',
   'ACCS-002', 79.99, 20.00, 0.200, 3, 1, 1, 1, @tax_iva15),

  (@prod6, 'Perfume Floral Intenso 50ml', 'perfume-floral-intenso',
   'Fragancia floral con notas de jazmín, rosa y vainilla. Duración de hasta 8 horas.',
   'COSM-002', 55.00, 0.00, 0.250, 5, 0, 1, 1, @tax_iva15);

-- Variantes de productos
INSERT INTO product_variants (id, product_id, name, sku, stock, price_override) VALUES
  (UUID(), @prod1, 'Negro - Talla Única', 'ACCS-001-BK', 20,   NULL),
  (UUID(), @prod2, 'Talla S - Azul',      'MODA-001-S',  15,   NULL),
  (UUID(), @prod2, 'Talla M - Azul',      'MODA-001-M',  25,   NULL),
  (UUID(), @prod2, 'Talla L - Azul',      'MODA-001-L',  12,   NULL),
  (UUID(), @prod2, 'Talla XL - Azul',     'MODA-001-XL', 8,    NULL),
  (UUID(), @prod3, 'Set Completo',        'COSM-001-KIT',18,   NULL),
  (UUID(), @prod4, 'Gris Geométrico',     'HOGA-001-GR', 30,   NULL),
  (UUID(), @prod4, 'Azul Geométrico',     'HOGA-001-AZ', 22,   NULL),
  (UUID(), @prod5, 'Plateado - Unisex',   'ACCS-002-PL', 4,    NULL),
  (UUID(), @prod6, 'Floral 50ml',         'COSM-002-50', 14,   NULL);

-- Asignar categorías
INSERT INTO product_categories (product_id, category_id) VALUES
  (@prod1, @cat_acces),
  (@prod2, @cat_moda),
  (@prod3, @cat_cosme),
  (@prod4, @cat_hogar),
  (@prod5, @cat_acces),
  (@prod6, @cat_cosme);

-- Imágenes placeholder (Cloudinary no disponible en local, usar URLs de prueba)
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
  (UUID(), @prod1, 'https://placehold.co/400x400/132149/74b8d3?text=Bolso', 0, 1),
  (UUID(), @prod2, 'https://placehold.co/400x400/132149/74b8d3?text=Camisa', 0, 1),
  (UUID(), @prod3, 'https://placehold.co/400x400/132149/74b8d3?text=Set+Cremas', 0, 1),
  (UUID(), @prod4, 'https://placehold.co/400x400/132149/74b8d3?text=Cojín', 0, 1),
  (UUID(), @prod5, 'https://placehold.co/400x400/132149/74b8d3?text=Reloj', 0, 1),
  (UUID(), @prod6, 'https://placehold.co/400x400/132149/74b8d3?text=Perfume', 0, 1);

-- =============================================================
-- FIN DEL SCRIPT PROTOTIPO
-- Credenciales de acceso:
--   Admin:   admin@kumarstore.com   / Admin2026!
--   Cliente: cliente@kumarstore.com / Cliente2026!
-- =============================================================
