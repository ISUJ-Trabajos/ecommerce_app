import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', AuthController.login);
  app.post('/auth/register', AuthController.register);
  app.post('/auth/refresh', AuthController.refresh);
  app.post('/auth/logout', AuthController.logout);
}
