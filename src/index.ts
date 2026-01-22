import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { container } from './infraestructure/config/container';
import { logger } from './infraestructure/config/logger';
import { ProcessRoutes } from './interfaces/http/ProcessRoutes';
import { getPrismaClient } from './infraestructure/persistence/prisma/PrismaClient';

// Stream para Morgan -> Winston
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream }));

// Conectar rutas
const processRoutes = container.get(ProcessRoutes);
app.use('/api/processes', processRoutes.router);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Conectar Prisma
getPrismaClient()
  .$connect()
  .then(() => {
    logger.info('Prisma connected');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => logger.error('Prisma connection failed', err));