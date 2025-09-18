import { Controller, Get, Param, Query } from "@nestjs/common";
import { CategoriesService } from "./categories.service";

@Controller("api/v1/categories")
export class CategoriesController {
  constructor(private readonly svc: CategoriesService) {}

  @Get(":slug/products")
  async products(@Param("slug") slug: string, @Query("page") page = "1") {
    const pageNum = parseInt(page as string, 10) || 1;
    const results = await this.svc.productsForCategory(slug, pageNum);
    return { data: results, meta: { page: pageNum } };
  }
}
