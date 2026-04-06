import { FastifyInstance } from 'fastify';
import { WishlistController } from './wishlist.controller';
import { authenticate } from '../../middlewares/authenticate';

export async function wishlistRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/wishlist', WishlistController.getWishlist);
  app.get('/wishlist/ids', WishlistController.getWishlistIds);
  app.post('/wishlist/items', WishlistController.addItem);
  app.delete('/wishlist/items/:productId', WishlistController.removeItem);
}
