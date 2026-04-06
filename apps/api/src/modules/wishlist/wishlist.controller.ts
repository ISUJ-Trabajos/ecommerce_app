import { FastifyRequest, FastifyReply } from 'fastify';
import { WishlistService } from './wishlist.service';

export class WishlistController {
  static async getWishlist(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as any;
    const wishlist = await WishlistService.getWishlist(authReq.user.id);
    reply.send({ success: true, data: wishlist });
  }

  static async getWishlistIds(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as any;
    const ids = await WishlistService.getWishlistIds(authReq.user.id);
    reply.send({ success: true, data: ids });
  }

  static async addItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authReq = request as any;
      const { productId } = request.body as any;
      if (!productId) return reply.status(400).send({ success: false, error: 'productId requerido' });
      const wishlist = await WishlistService.addItem(authReq.user.id, productId);
      reply.send({ success: true, data: wishlist });
    } catch (e: any) {
      const msg = e.message.split('|');
      reply.status(msg[0] === 'NOT_FOUND' ? 404 : 500).send({ success: false, error: msg[1] || e.message });
    }
  }

  static async removeItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authReq = request as any;
      const { productId } = request.params as any;
      const wishlist = await WishlistService.removeItem(authReq.user.id, productId);
      reply.send({ success: true, data: wishlist });
    } catch (e: any) {
      const msg = e.message.split('|');
      reply.status(msg[0] === 'NOT_FOUND' ? 404 : 500).send({ success: false, error: msg[1] || e.message });
    }
  }
}
