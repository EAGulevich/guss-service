import sequelize from './db';

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');
    } catch (e) {
        console.error('DB error:', e);
    }
};
start();
