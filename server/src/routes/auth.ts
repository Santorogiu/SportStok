import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request) => {
    const bodySchema = z.object({
      username: z.string(),
      password: z.string(),
    });

    const { username, password } = bodySchema.parse(request.body);

    let user = await prisma.user.findFirstOrThrow({
      where: {
        username: username,
        password: password,
      },
    });

    return {
      token: {
        id: user.id,
        name: user.name,
      },
    };
  });
}
