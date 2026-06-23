// ¡Ya no hay imports de Prisma aquí!

export interface UnitOfWork {
  /**
   * Ejecuta una función dentro de una transacción atómica totalmente aislada
   */
  run<T>(work: () => Promise<T>): Promise<T>;
}