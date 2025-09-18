import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import sequelize from './db';
import './models/User';
import './models/Round';
import './models/PlayerRound';
import authRoutes from './routes/auth';
import roundsRoutes from './routes/rounds';

const app = fastify({ logger: true });

app.register(fastifyCors, {
    origin: 'http://localhost:5173', // TODO
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

app.register(fastifyCookie);
app.register(authRoutes);
app.register(roundsRoutes);

const start = async () => {
    await sequelize.sync({ alter: true });
    await app.listen({ port: 3000 });
    console.log('Server running on port 3000');
};
start();
