import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";

// Redis connection
const connection = new IORedis();

const queueName = "scraping-queue";

// Worker to process jobs
const worker = new Worker(
  queueName,
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);

    // Do your scraping / processing logic here
    return { success: true, processedAt: new Date().toISOString() };
  },
  { connection }
);

// Optional: Queue instance if you want to add jobs programmatically
export const scrapingQueue = new Queue(queueName, { connection });

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});
