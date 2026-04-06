import { FastifyReply, FastifyRequest } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ success: false, error: 'Acceso no autorizado / Token inválido' });
  }
};
