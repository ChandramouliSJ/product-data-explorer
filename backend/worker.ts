import "dotenv/config";
import { Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";
import { PlaywrightCrawler } from "crawlee";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

new QueueScheduler("scrape", { connection });

const worker = new Worker("scrape", async (job) => {
  console.log("Worker processing job:", job.id, job.name, job.data);
  if (job.name === "product") {
    const { url } = job.data;
    const crawler = new PlaywrightCrawler({
      launchContext: { launchOptions: { headless: true } },
      async requestHandler({ page }) {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        const title = await page.$eval("h1, .product-title", el => el.textContent?.trim()).catch(() => null);
        const parts = url.split("/").filter(Boolean);
        const sourceId = parts[parts.length - 1] || url;
        await prisma.product.upsert({
          where: { source_id: sourceId },
          update: { title: title ?? undefined, last_scraped_at: new Date() },
          create: { source_id: sourceId, title: title ?? null, source_url: url, last_scraped_at: new Date() }
        });
      }
    });
    await crawler.run([url]);
  }
}, { connection });

worker.on("completed", job => console.log("Job completed", job.id));
worker.on("failed", (job, err) => console.error("Job failed", job?.id, err));
console.log("Worker started");
