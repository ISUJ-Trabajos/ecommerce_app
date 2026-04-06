import { FastifyInstance } from 'fastify';
import { CatalogController } from './catalog.controller';

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/categories', CatalogController.getCategories);
  app.get('/products/featured', CatalogController.getFeatured);
  app.get('/products', CatalogController.getProducts);
  app.get('/products/:slug', CatalogController.getProductBySlug);
}
