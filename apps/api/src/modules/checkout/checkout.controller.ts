import { FastifyRequest, FastifyReply } from 'fastify';
import { CheckoutService } from './checkout.service';

export class CheckoutController {
  
  static async getShippingZones(_request: FastifyRequest, reply: FastifyReply) {
    const zones = await CheckoutService.getShippingZones();
    reply.send({ success: true, data: zones });
  }

  static async createOrder(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authReq = request as any;
      const { shippingAddressId, shippingZoneId, paymentMethod, notes } = request.body as any;

      if (!shippingAddressId || !shippingZoneId || !paymentMethod) {
        return reply.status(400).send({ success: false, error: 'Faltan parámetros de envío o pago' });
      }

      const orderData = await CheckoutService.createOrder(authReq.user.id, {
        shippingAddressId,
        shippingZoneId,
        paymentMethod,
        notes
      });

      reply.status(201).send({ success: true, data: orderData });
      
    } catch (error: any) {
      const message = error.message.split('|');
      const status = message[0] === 'CONFLICT' ? 409 : (message[0] === 'NOT_FOUND' ? 404 : 500);
      reply.status(status).send({ success: false, error: message[1] || error.message });
    }
  }

}
