import sequelize from './db';
import './models/User'; // Импортируем модели
import './models/Round';
import './models/PlayerRound';

const start = async () => {
    await sequelize.sync({ alter: true }); // Создаёт/обновляет таблицы
    console.log('Models synced');
};
start();
