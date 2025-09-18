import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { config } from "../config";

export interface UserPayload {
  id: number;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: UserPayload;
  }
}

export const generateToken = (user: UserPayload) => {
  return jwt.sign(user, config.jwtSecret, { expiresIn: "1h" });
};

export const authMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const token = req.cookies.token;

  if (!token) {
    return reply.code(401).send({ error: "UNAUTHORIZED" });
  }
  try {
    req.user = jwt.verify(token, config.jwtSecret) as UserPayload;
  } catch {
    return reply.code(401).send({ error: "INVALID_TOKEN" });
  }
};
