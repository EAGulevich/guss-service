import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import sequelize from './db';
import './models/User';
import './models/Round';
import './models/PlayerRound';
import authRoutes from './routes/auth';

const app = fastify({ logger: true });
app.register(fastifyCookie);
app.register(authRoutes);

const start = async () => {
    await sequelize.sync({ alter: true });
    await app.listen({ port: 3000 });
    console.log('Server running on port 3000');
};
start();
