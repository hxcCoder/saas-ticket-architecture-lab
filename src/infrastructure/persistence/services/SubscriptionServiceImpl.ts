import { injectable } from "inversify";
import { SubscriptionService } from "../../../application/use-cases/ports/SubscriptionService.js";
import { getPrismaClient } from "../../persistence/prisma/PrismaClient.js";

@injectable()
export class SubscriptionServiceImpl implements SubscriptionService {
  private prisma = getPrismaClient();

  async canCreateProcess(organizationId: string): Promise<boolean> {
    try {
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          organizationId,
          status: "ACTIVE",
        },
        include: {
          plan: true,
        },
      });

      // Desarrollo:
      // si la organización aún no tiene suscripción,
      // permitimos crear procesos.

      if (!subscription) {
        console.warn(
          `[DEV] Organization ${organizationId} has no subscription. Allowing process creation.`
        );

        return true;
      }

      const activeProcesses = await this.prisma.process.count({
        where: {
          organizationId,
          status: "ACTIVE",
        },
      });

      return activeProcesses < subscription.plan.maxActiveProcesses;
    } catch (error) {
      console.error(
        "Subscription validation failed:",
        error
      );

      return false;
    }
  }
}