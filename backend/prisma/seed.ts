import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const nav = await prisma.navigation.upsert({
    where: { slug: "books" },
    update: {},
    create: { title: "Books", slug: "books" }
  });

  await prisma.category.upsert({
    where: { slug: "fiction" },
    update: {},
    create: {
      navigation_id: nav.id,
      title: "Fiction",
      slug: "fiction",
      product_count: 1
    }
  });

  const p = await prisma.product.upsert({
    where: { source_id: "mock-123" },
    update: {},
    create: {
      source_id: "mock-123",
      title: "Mocked Book",
      author: "Author A",
      price: 9.99,
      currency: "GBP",
      image_url: "https://placehold.co/200x300",
      source_url: "https://example.com/mock-123"
    }
  });

  await prisma.productDetail.upsert({
    where: { product_id: p.id },
    update: {},
    create: {
      product_id: p.id,
      description: "This is a seeded product used for local testing.",
      specs: { isbn: "1234567890", publisher: "Seed Pub" },
      ratings_avg: 4.2,
      reviews_count: 2
    }
  });

  await prisma.review.createMany({
    data: [
      { productId: p.id, author: "Alice", rating: 5, text: "Great!" },
      { productId: p.id, author: "Bob", rating: 4, text: "Nice read" }
    ],
    skipDuplicates: true
  });

  console.log("Seed complete");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
