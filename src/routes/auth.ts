import { FastifyInstance, FastifyRequest } from "fastify";

import User, { Role } from "../models/User";
import { generateToken } from "../utils/auth";

interface LoginRequest {
  username: string;
  password: string;
}

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/login",
    async (req: FastifyRequest<{ Body: LoginRequest }>, reply) => {
      const { username, password } = req.body;
      let user = await User.findOne({ where: { username } });
      if (!user) {
        let role = Role.Survivor;
        if (username.toLowerCase() === "admin") {
          role = Role.Admin;
        } else if (
          username.toLowerCase() === "никита" ||
          username.toLowerCase() === "nikita"
        ) {
          role = Role.Nikita;
        }
        user = await User.create({ username, password, role });
      } else if (user.password !== password) {
        return reply.code(400).send({ error: "WRONG_PASSWORD" });
      }
      const token = generateToken({ id: user.id, role: user.role });
      reply.setCookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      return { user: { id: user.id, username, role: user.role }, token };
    },
  );
}
