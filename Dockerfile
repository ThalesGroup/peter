# Install dependenciees only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY .npmrc ./.npmrc
RUN npm i

# Rebuild thee source code only when needed
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Production image, copy all files and run vite
FROM node:alpine as runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/package.json ./package.json

## EXPOSE [Port you mentioned in the vite.config file]
EXPOSE 4173

CMD ["npm", "run", "preview"]
