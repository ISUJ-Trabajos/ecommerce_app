import { FastifyInstance } from 'fastify';
import { CartController } from './cart.controller';
import { authenticate } from '../../middlewares/authenticate';

export async function cartRoutes(app: FastifyInstance) {
  // Todas las rutas de carrito son en contexto protegido
  app.addHook('preHandler', authenticate);

  app.get('/cart', CartController.getCart);
  app.post('/cart/items', CartController.addItem);
  app.patch('/cart/items/:id', CartController.updateItemQuantity);
  app.delete('/cart/items/:id', CartController.removeItem);
}
