import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import authPlugin from './plugins/auth.plugin';

dotenv.config();

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: '*', // For local dev
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  await app.register(authPlugin);
  
  app.register(async (api) => {
    const { authRoutes } = await import('./modules/auth/auth.routes');
    api.register(authRoutes);

    const { catalogRoutes } = await import('./modules/catalog/catalog.routes');
    api.register(catalogRoutes);
  });

  app.get('/health', async () => {
    return { status: 'ok', message: 'KUMAR Store API is running' };
  });

  return app;
};
