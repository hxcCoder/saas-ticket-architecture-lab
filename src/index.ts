import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

//
import { container } from './infrastructure/config/container.js';
import { logger } from './infrastructure/config/logger.js';
import { ProcessRoutes } from './interfaces/http/ProcessRoutes.js';
import { getPrismaClient } from './infrastructure/persistence/prisma/PrismaClient.js';

// Stream para Morgan -> Winston
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

const app = express();
const PORT = process.env.PORT || 3000;

// Instanciamos Prisma
const prisma = getPrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream }));

// Conectar rutas principales
const processRoutes = container.get(ProcessRoutes);
app.use('/api/processes', processRoutes.router);

//  Para el Paso 1 de tu Dashboard (Crear Organización)
app.post('/api/organizations', async (req: Request, res: Response) => {
  try {
    const { name, status, plan } = req.body;
    const newOrg = await prisma.organization.create({
      data: { name, status, plan }
    });
    // Devolvemos el ID generado al dashboard
    res.status(201).json(newOrg);
  } catch (error) {
    logger.error('Error al crear la organización', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => res.json({ status: 'OK' }));

// Conectar Prisma y levantar servidor
prisma.$connect()
  .then(() => {
    logger.info('Prisma connected');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err: unknown) => {
    logger.error('Prisma connection failed', err);
  });