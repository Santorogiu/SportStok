import "dotenv/config";

import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { resolve } from "node:path";
import { authRoutes } from "./routes/auth";
import { categoryRoutes } from "./routes/category";
import { productsRoutes } from "./routes/products";
import { uploadRoutes } from "./routes/upload";
import jwt from "@fastify/jwt";

const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: "agenda",
});

app.register(authRoutes);
app.register(uploadRoutes);
app.register(productsRoutes);
app.register(categoryRoutes);

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log("🚀 HTTP server running on port http://localhost:3333");
  });
