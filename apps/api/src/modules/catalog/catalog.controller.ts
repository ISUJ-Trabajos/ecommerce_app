import { FastifyRequest, FastifyReply } from 'fastify';
import { CatalogService } from './catalog.service';

export class CatalogController {
  static async getCategories(_request: FastifyRequest, reply: FastifyReply) {
    const categories = await CatalogService.getCategories();
    reply.send({ success: true, data: categories });
  }

  static async getFeatured(_request: FastifyRequest, reply: FastifyReply) {
    const data = await CatalogService.getFeatured();
    reply.send({ success: true, data });
  }

  static async getProducts(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const data = await CatalogService.getProducts({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      category: query.category,
      search: query.search,
      min_price: query.min_price ? Number(query.min_price) : undefined,
      max_price: query.max_price ? Number(query.max_price) : undefined,
      sort: query.sort,
    });
    reply.send({ success: true, data: data.products, pagination: data.pagination });
  }

  static async getProductBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as any;
    const product = await CatalogService.getProductBySlug(slug);
    if (!product) {
      return reply.status(404).send({ success: false, error: 'Producto no encontrado' });
    }
    reply.send({ success: true, data: product });
  }
}
