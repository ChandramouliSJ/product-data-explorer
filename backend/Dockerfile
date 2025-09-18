FROM node:18-bullseye-slim
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates wget gnupg --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3001
CMD ["npm", "run", "start"]
