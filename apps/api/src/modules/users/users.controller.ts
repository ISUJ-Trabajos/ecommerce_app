import { FastifyRequest, FastifyReply } from 'fastify';
import { UsersService } from './users.service';

export class UsersController {
  static async getAddresses(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as any;
    const addresses = await UsersService.getAddresses(authReq.user.id);
    reply.send({ success: true, data: addresses });
  }

  static async addAddress(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as any;
    try {
      const addresses = await UsersService.addAddress(authReq.user.id, request.body);
      reply.send({ success: true, data: addresses });
    } catch (e: any) {
      reply.status(500).send({ success: false, error: e.message });
    }
  }
}
