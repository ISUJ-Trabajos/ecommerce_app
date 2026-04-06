import { FastifyInstance } from 'fastify';
import { CheckoutController } from './checkout.controller';
import { authenticate } from '../../middlewares/authenticate';

export async function checkoutRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/shipping/zones', CheckoutController.getShippingZones);
  app.post('/orders', CheckoutController.createOrder);
}
