import { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller';
import { authenticate } from '../../middlewares/authenticate';

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  
  app.get('/users/me/addresses', UsersController.getAddresses);
  app.post('/users/me/addresses', UsersController.addAddress);
}
