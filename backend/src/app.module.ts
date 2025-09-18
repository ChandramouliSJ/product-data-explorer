import { Module } from "@nestjs/common";
import { ScrapeModule } from "./scrape/scrape.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";

@Module({
  imports: [ScrapeModule, ProductsModule, CategoriesModule],
})
export class AppModule {}
