import { FastifyInstance } from "fastify";

import sequelize from "../db";
import PlayerRound from "../models/PlayerRound";
import Round from "../models/Round";
import { authMiddleware } from "../utils/auth";

export default async function tapRoutes(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    "/rounds/:id/tap",
    { preHandler: authMiddleware },
    async (req, reply) => {
      const { id } = req.params;
      const userId = req.user?.id;
      const role = req.user?.role;

      return await sequelize.transaction(async (t) => {
        const round = await Round.findByPk(id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!round) {
          return reply.code(404).send({ error: "ROUND_NOT_FOUND" });
        }

        const now = new Date();
        if (now < round.startDate || now > round.endDate) {
          return reply.code(400).send({ error: "ROUND_NOT_ACTIVE" });
        }

        let playerStats = await PlayerRound.findOne({
          where: { userId, roundId: id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!playerStats) {
          playerStats = await PlayerRound.create(
            { userId, roundId: id, taps: 0, points: 0 },
            { transaction: t },
          );
        }

        playerStats.taps += 1;

        let pointsToAdd = 0;
        if (role !== "nikita") {
          pointsToAdd = 1;
          if (playerStats.taps % 11 === 0) {
            pointsToAdd = 10;
          }
          playerStats.points += pointsToAdd;
          round.totalPoints += pointsToAdd;
        }

        await playerStats.save({ transaction: t });
        await round.save({ transaction: t });

        return { myPoints: role === "nikita" ? 0 : playerStats.points };
      });
    },
  );
}
