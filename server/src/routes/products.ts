import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function productsRoutes(app: FastifyInstance) {
  app.get("/products", async (request) => {
    const products = await prisma.product.findMany();

    return products.map(
      (product: {
        id: string;
        name: string;
        imageUrl: string | null;
        quantity: number;
        size: number | null;
        color: string;
        categoryId: string;
        createdAt: Date;
      }) => {
        return {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          quantity: product.quantity,
          size: product.size,
          color: product.color,
          categoryId: product.categoryId,
          createdAt: product.createdAt,
        };
      }
    );
  });

  app.get("/product/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    return product;
  });

  app.post("/product", async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      imageUrl: z.string(),
      quantity: z.string(),
      size: z.string(),
      color: z.string(),
      categoryId: z.string(),
    });

    const { name, imageUrl, quantity, size, color, categoryId } =
      bodySchema.parse(request.body);

    const product = await prisma.product.create({
      data: {
        name,
        imageUrl,
        quantity: parseInt(quantity),
        size: parseInt(size),
        color,
        categoryId,
        createdAt: new Date(),
      },
    });

    return product;
  });

  app.delete("/product/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.product.delete({
      where: {
        id,
      },
    });
  });
}
