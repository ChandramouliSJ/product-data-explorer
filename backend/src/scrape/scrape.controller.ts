import { Controller, Get, Query } from "@nestjs/common";
import { ScrapeService } from "./scrape.service";

@Controller("api/v1/scrape")
export class ScrapeController {
  constructor(private readonly svc: ScrapeService) {}

  @Get("nav")
  async nav() { return this.svc.scrapeNavigation(); }

  @Get("category")
  async category(@Query("url") url: string) {
    if (!url) return { error: "url query param required" };
    return this.svc.scrapeCategory(url);
  }

  @Get("product")
  async product(@Query("url") url: string) {
    if (!url) return { error: "url query param required" };
    return this.svc.scrapeProductDetail(url);
  }
}
