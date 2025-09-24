import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ScrapeModule } from './scrape/scrape.module';

@Module({
  imports: [ScrapeModule],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
