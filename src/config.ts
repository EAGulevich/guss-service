import dotenv from 'dotenv';
dotenv.config();

export const config = {
    dbUrl: process.env.DATABASE_URL as string,
    roundDuration: parseInt(process.env.ROUND_DURATION || '60') * 1000,
    cooldownDuration: parseInt(process.env.COOLDOWN_DURATION || '30') * 1000,
};
