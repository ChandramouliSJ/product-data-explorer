import { Injectable, Logger } from "@nestjs/common";
import { PlaywrightCrawler } from "crawlee";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  async scrapeNavigation() {
    this.logger.log("Scraping navigation...");
    const crawler = new PlaywrightCrawler({
      launchContext: { launchOptions: { headless: true } },
      async requestHandler({ page }) {
        await page.goto("https://www.worldofbooks.com/", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(800);
        const navs = await page.$$eval("header a, nav a", nodes =>
          nodes.map(a => ({ title: (a as HTMLElement).innerText?.trim(), url: (a as HTMLAnchorElement).href })).filter(x => x.title && x.url)
        ).catch(() => []);
        return navs;
      }
    });
    const res = await crawler.run(["https://www.worldofbooks.com/"]);
    return res.flat ? res.flat() : [].concat(...res);
  }

  async scrapeCategory(url: string) {
    this.logger.log("Scraping category: " + url);
    const crawler = new PlaywrightCrawler({
      launchContext: { launchOptions: { headless: true } },
      async requestHandler({ page }) {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1000);
        const items = await page.$$eval("article, .product, .product-card, .product-listing", els => {
          return els.map(el => {
            const anchor = el.querySelector("a") as HTMLAnchorElement;
            const title = el.querySelector("h2, h3, .product-title, .title")?.textContent?.trim() || null;
            const author = el.querySelector(".author, .product-author")?.textContent?.trim() || null;
            const price = el.querySelector(".price, .product-price")?.textContent?.trim() || null;
            const image = (el.querySelector("img") as HTMLImageElement)?.src || null;
            const href = anchor?.href || null;
            return { title, author, price, image, url: href };
          }).filter(i => i.url);
        }).catch(() => []);
        return items;
      }
    });
    const results = await crawler.run([url]);
    const flat = results.flat ? results.flat() : [].concat(...results);
    for (const p of flat) {
      if (!p.url) continue;
      const parts = p.url.split("/").filter(Boolean);
      const sourceId = parts[parts.length - 1] || p.url;
      const numericPrice = p.price ? parseFloat(String(p.price).replace(/[^0-9\\.]/g, "")) : null;
      try {
        await prisma.product.upsert({
          where: { source_id: sourceId },
          update: {
            title: p.title ?? undefined,
            author: p.author ?? undefined,
            price: numericPrice ?? undefined,
            image_url: p.image ?? undefined,
            source_url: p.url,
            last_scraped_at: new Date()
          },
          create: {
            source_id: sourceId,
            title: p.title ?? null,
            author: p.author ?? null,
            price: numericPrice,
            currency: "GBP",
            image_url: p.image ?? null,
            source_url: p.url,
            last_scraped_at: new Date()
          }
        });
      } catch (e) {
        this.logger.warn("Product upsert failed: " + e.message);
      }
    }
    return flat;
  }

  async scrapeProductDetail(url: string) {
    this.logger.log("Scraping product detail: " + url);
    const crawler = new PlaywrightCrawler({
      launchContext: { launchOptions: { headless: true } },
      async requestHandler({ page }) {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(800);
        const title = await page.$eval("h1, .product-title, .title", el => el.textContent?.trim()).catch(() => null);
        const description = await page.$eval("#description, .product-description, .description", el => el.textContent?.trim()).catch(() => null);
        const pageText = await page.evaluate(() => document.body.innerText);
        const isbnMatch = pageText.match(/ISBN(?:-13)?:?\\s*([0-9\\-\\s]+)/i);
        const publisherMatch = pageText.match(/Publisher:?\\s*(.+)/i);
        const pubDateMatch = pageText.match(/Publication date:?\\s*(.+)/i);
        const publisher = publisherMatch ? publisherMatch[1].trim() : null;
        const isbn = isbnMatch ? isbnMatch[1].trim() : null;
        const publication_date = pubDateMatch ? pubDateMatch[1].trim() : null;
        const reviews = await page.$$eval(".review, .reviews .review, .product-review", nodes => nodes.slice(0,10).map(n => {
          const author = (n.querySelector(".author") as HTMLElement)?.innerText || null;
          const rating = (n.querySelector(".rating") as HTMLElement)?.innerText || null;
          const text = (n.querySelector(".text, .review-text") as HTMLElement)?.innerText || null;
          return { author, rating, text };
        })).catch(() => []);
        return { title, description, publisher, isbn, publication_date, reviews };
      }
    });
    const results = await crawler.run([url]);
    const detail = results && results[0] ? results[0] : results;
    if (detail) {
      const parts = url.split("/").filter(Boolean);
      const sourceId = parts[parts.length - 1] || url;
      let product = await prisma.product.findUnique({ where: { source_id: sourceId } });
      if (!product) {
        product = await prisma.product.create({ data: { source_id: sourceId, title: detail.title ?? null, source_url: url, last_scraped_at: new Date() }});
      }
      await prisma.productDetail.upsert({
        where: { product_id: product.id },
        update: {
          description: detail.description ?? undefined,
          specs: { publisher: detail.publisher, publication_date: detail.publication_date, isbn: detail.isbn },
          reviews_count: detail.reviews ? detail.reviews.length : 0,
          updated_at: new Date()
        },
        create: {
          product_id: product.id,
          description: detail.description ?? null,
          specs: { publisher: detail.publisher, publication_date: detail.publication_date, isbn: detail.isbn },
          reviews_count: detail.reviews ? detail.reviews.length : 0
        }
      });
      if (detail.reviews && detail.reviews.length) {
        const reviewsData = detail.reviews.map((r:any) => ({ productId: product.id, author: r.author, rating: null, text: r.text }));
        try {
          await prisma.review.createMany({ data: reviewsData, skipDuplicates: true });
        } catch (e) {
          this.logger.warn("createMany reviews failed: " + e.message);
        }
      }
    }
    return detail;
  }
}
