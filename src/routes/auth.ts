import { FastifyInstance } from 'fastify';
import User, { Role } from '../models/User';
import { generateToken } from '../utils/auth';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/login', async (req, reply) => {
        const { username, password } = req.body as { username: string; password: string };
        let user = await User.findOne({ where: { username } });
        if (!user) {
            let role = Role.Survivor;
            if (username.toLowerCase() === 'admin') role = Role.Admin;
            if (username.toLowerCase() === 'никита' || username.toLowerCase() === 'nikita') role = Role.Nikita;
            user = await User.create({ username, password, role });
        } else if (user.password !== password) {
            return reply.code(400).send({ error: 'Wrong password' });
        }
        const token = generateToken({ id: user.id, role: user.role });
        reply.setCookie('token', token, { httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'none',
            });
        return { user: { id: user.id, username, role: user.role } };
    });
}
