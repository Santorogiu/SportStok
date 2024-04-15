import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function categoryRoutes(app: FastifyInstance) {
  app.get("/category", async (request) => {
    const categorys = await prisma.category.findMany();

    return categorys.map((category: { id: string; name: string }) => {
      return {
        id: category.id,
        name: category.name,
      };
    });
  });
}
