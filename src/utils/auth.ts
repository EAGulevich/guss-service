import jwt from 'jsonwebtoken';

import { config } from '../config';

export interface UserPayload {
    id: number;
    role: string;
}

export const generateToken = (user: UserPayload) => {
    return jwt.sign(user, config.jwtSecret, { expiresIn: '1h' });
};
