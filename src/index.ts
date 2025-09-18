import "./models/User";
import "./models/Round";
import "./models/PlayerRound";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";

import sequelize from "./db";
import authRoutes from "./routes/auth";
import roundsRoutes from "./routes/rounds";
import tapRoutes from "./routes/tap";

const PORT = process.env.PORT || "3000";

const app = fastify({ logger: true });

app.register(fastifyCors, {
  origin: ["http://localhost:5173", "https://guss-ui.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(fastifyCookie);
app.register(authRoutes);
app.register(roundsRoutes);
app.register(tapRoutes);

const start = async () => {
  await sequelize.sync({ alter: true });
  await app.listen({ port: parseInt(PORT), host: "0.0.0.0" });
  console.log(`Successfully running on port ${PORT}.`);
};
start();
