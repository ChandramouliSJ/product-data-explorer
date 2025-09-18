import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class CategoriesService {
  async productsForCategory(slug: string, page = 1, limit = 24) {
    const skip = (page - 1) * limit;
    return prisma.product.findMany({ take: limit, skip });
  }
}
