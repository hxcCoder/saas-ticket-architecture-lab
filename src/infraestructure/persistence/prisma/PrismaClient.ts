import { PrismaClient } from "../../../generated/prisma/client"; // ajusta el path según tu proyecto
import 'dotenv/config';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // opcional
});
