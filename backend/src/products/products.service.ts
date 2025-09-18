import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  async findBySourceId(sourceId: string) {
    return prisma.product.findUnique({ where: { source_id: sourceId }, include: { detail: true, reviews: true }});
  }

  async list(page = 1, limit = 24) {
    const skip = (page - 1) * limit;
    return prisma.product.findMany({ take: limit, skip });
  }
}
