import { FastifyInstance } from 'fastify';
import { OrdersController } from './orders.controller';
import { authenticate } from '../../middlewares/authenticate';

export async function ordersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/orders', OrdersController.getUserOrders);
  app.get('/orders/:id', OrdersController.getOrderDetail);
}
