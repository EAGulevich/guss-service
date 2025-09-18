import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import sequelize from './db';
import './models/User';
import './models/Round';
import './models/PlayerRound';
import authRoutes from './routes/auth';
import roundsRoutes from './routes/rounds';
import tapRoutes from './routes/tap';

const PORT = process.env.PORT || 5001;

const app = fastify({ logger: true });

app.register(fastifyCors, {
    origin: 'https://guss-ui.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

app.register(fastifyCookie);
app.register(authRoutes);
app.register(roundsRoutes);
app.register(tapRoutes);

const start = async () => {
    await sequelize.sync({ alter: true });
    await app.listen({ port: +PORT });
    console.log(`Successfully running on port ${PORT}.`);
};
start();
