import { FastifyRequest, FastifyReply } from 'fastify';
import { OrdersService } from './orders.service';

export class OrdersController {
  static async getUserOrders(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as any;
    const orders = await OrdersService.getUserOrders(authReq.user.id);
    reply.send({ success: true, data: orders });
  }

  static async getOrderDetail(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as any;
    const { id } = request.params as any;
    const order = await OrdersService.getOrderDetail(authReq.user.id, id);
    if (!order) {
      return reply.status(404).send({ success: false, error: 'Pedido no encontrado' });
    }
    reply.send({ success: true, data: order });
  }
}
