import { Controller, Get, Param, Query, NotFoundException } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("api/v1/products")
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get(":sourceId")
  async getOne(@Param("sourceId") sourceId: string) {
    const p = await this.svc.findBySourceId(sourceId);
    if (!p) throw new NotFoundException();
    return { data: p };
  }

  @Get()
  async list(@Query("page") page = "1", @Query("limit") limit = "24") {
    const pageNum = parseInt(page as string, 10);
    const lim = parseInt(limit as string, 10);
    const items = await this.svc.list(pageNum, lim);
    return { data: items, meta: { page: pageNum } };
  }
}
