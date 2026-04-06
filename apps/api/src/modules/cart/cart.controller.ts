import { FastifyRequest, FastifyReply } from 'fastify';
import { CartService } from './cart.service';

export class CartController {
  
  static async getCart(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authReq = request as any;
      const cart = await CartService.getCart(authReq.user.id);
      reply.send({ success: true, data: cart });
    } catch (error: any) {
      reply.status(500).send({ success: false, error: 'Error obteniendo carrito' });
    }
  }

  static async addItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authReq = request as any;
      const { productId, variantId, quantity } = request.body as any;

      if (!productId || !quantity || quantity <= 0) {
        return reply.status(400).send({ success: false, error: 'Datos de producto inválidos' });
      }

      const cart = await CartService.addItem(authReq.user.id, productId, variantId || null, quantity);
      reply.send({ success: true, data: cart });
    } catch (error: any) {
      const message = error.message.split('|');
      const status = message[0] === 'NOT_FOUND' ? 404 : (message[0] === 'STOCK_EXCEEDED' ? 409 : 500);
      reply.status(status).send({ success: false, error: message[1] || error.message });
    }
  }

  static async updateItemQuantity(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authReq = request as any;
      const { id } = request.params as any;
      const { quantity } = request.body as any;

      if (quantity === undefined || quantity < 0) {
        return reply.status(400).send({ success: false, error: 'Cantidad inválida' });
      }

      const cart = await CartService.updateItemQuantity(authReq.user.id, id, quantity);
      reply.send({ success: true, data: cart });
    } catch (error: any) {
      const message = error.message.split('|');
      const status = message[0] === 'NOT_FOUND' ? 404 : (message[0] === 'STOCK_EXCEEDED' ? 409 : 500);
      reply.status(status).send({ success: false, error: message[1] || error.message });
    }
  }

  static async removeItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authReq = request as any;
      const { id } = request.params as any;
      
      const cart = await CartService.removeItem(authReq.user.id, id);
      reply.send({ success: true, data: cart });
    } catch (error: any) {
      const message = error.message.split('|');
      const status = message[0] === 'NOT_FOUND' ? 404 : 500;
      reply.status(status).send({ success: false, error: message[1] || error.message });
    }
  }
}
