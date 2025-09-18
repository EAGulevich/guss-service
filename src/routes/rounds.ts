import { FastifyInstance } from 'fastify';
import Round from '../models/Round';
import PlayerRound from '../models/PlayerRound';
import { config } from '../config';
import { authMiddleware } from '../utils/auth';
import User from '../models/User';
import {Includeable} from "sequelize";

export default async function roundsRoutes(fastify: FastifyInstance) {
    fastify.get('/rounds', { preHandler: authMiddleware }, async () => {
        return await Round.findAll({ order: [['startDate', 'DESC']] });
    });

    fastify.post('/rounds', { preHandler: authMiddleware }, async (req, reply) => {
        if (req.user!.role !== 'admin') return reply.code(403).send({ error: 'Forbidden' });
        const now = new Date();
        const startDate = new Date(now.getTime() + config.cooldownDuration);
        const endDate = new Date(startDate.getTime() + config.roundDuration);
        const round = await Round.create({ startDate, endDate });
        return { round };
    });

    fastify.get('/rounds/:id', { preHandler: authMiddleware }, async (req, reply) => {
        const { id } = req.params as { id: number };
        const round = await Round.findByPk(id);
        if (!round) return reply.code(404).send({ error: 'Round not found' });
        const now = new Date();
        const status = now < round.startDate ? 'pending' : now > round.endDate ? 'finished' : 'active';

        const playerStats = await PlayerRound.findOne({ where: { userId: req.user!.id, roundId: id } });
        const myPoints = playerStats ? (req.user!.role === 'nikita' ? 0 : playerStats.points) : 0;

        let winner = null;
        if (status === 'finished') {
            const stats = await PlayerRound.findAll({
                where: { roundId: id },
                order: [['points', 'DESC']],
                limit: 1,
                include: [{
                    model: User,
                    as: 'User',
                } as Includeable],
            });
            if (stats.length) {
                const user = stats[0].get('User') as User | undefined;
                winner = user?.username || null;
            }
        }

        return { round, status, myPoints, winner };
    });
}
