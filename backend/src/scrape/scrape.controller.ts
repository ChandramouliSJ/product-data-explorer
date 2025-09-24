// src/scrape/scrape.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('scrape')
export class ScrapeController {
  
  constructor() {
    // Initialize any services if needed
  }

  // Example GET endpoint
  @Get()
  async getScrapeData() {
    // Replace with your scraping logic
    return { message: 'Scrape GET endpoint working!' };
  }

  // Example POST endpoint
  @Post()
  async postScrapeData(@Body() body: any) {
    // Replace with your scraping logic
    return { message: 'Scrape POST endpoint received!', data: body };
  }

  // Example GET with parameter
  @Get(':id')
  async getScrapeById(@Param('id') id: string) {
    // Replace with your scraping logic
    return { message: `Scrape GET by id ${id}`, id };
  }
}
