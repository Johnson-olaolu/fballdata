#Build stage
FROM node:23-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:23-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/public ./dist/public
COPY --from=build /app/src/views ./dist/views
COPY --from=build /app/src/templates ./dist/templates

EXPOSE 5000

CMD ["node", "dist/server.js"]