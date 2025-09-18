# Product Data Explorer

This repo is a full-stack scaffold (backend NestJS, frontend Next.js) for a product data explorer that scrapes World of Books.

## Quickstart (Windows PowerShell)

1. Extract project (if zipped).
2. Open PowerShell in the project root.
3. Start Docker services:
   docker-compose -f docker-compose.dev.yml up --build -d
4. In another shell, initialize DB:
   cd backend
   npm install
   npm run install:playwright
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
5. Start frontend (if not running via docker):
   cd frontend
   npm install
   npm run dev

Frontend: http://localhost:3000
Backend (Swagger): http://localhost:3001/api
