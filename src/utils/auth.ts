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
  const tokenFromCookie = req.cookies.token;
  const authHeader = req.headers.authorization;

  if (!tokenFromCookie && (!authHeader || !authHeader.startsWith("Bearer "))) {
    return reply.code(401).send({ error: "UNAUTHORIZED" });
  }

  const tokenFromHeader = authHeader?.replace("Bearer ", "");

  const token = tokenFromCookie || tokenFromHeader || "";

  try {
    req.user = jwt.verify(token, config.jwtSecret) as UserPayload;
  } catch {
    return reply.code(401).send({ error: "INVALID_TOKEN" });
  }
};
