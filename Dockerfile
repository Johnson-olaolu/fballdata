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

#This is just a .env file
ENV PORT=5000
ENV NODE_ENV=development
ENV SITE_URL=http://localhost:5000

#I will use postgres configuration
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=mydb
ENV DB_HOST=host.docker.internal
ENV DB_DIALECT=postgres 


#fill your jwt secret key with random string or encoded string
ENV JWT_ACCESS_TOKEN_SECRET=1ZelYsfP1o1s0MphEr2R5f3r7pwYto7RJj
ENV JWT_EXPIRES_IN=7d

# email configuration
ENV EMAIL_USER=johnsonolaolu@gmail.com
ENV EMAIL_PASS=rcydpgxewcflpwjz

#Cloudinary
ENV CLOUDINARY_API_KEY=944983352454237
ENV CLOUDINARY_API_SECRET=U2EeJq3e534knsJzXGY_pOKKRAI
ENV CLOUDINARY_NAME=oljebra-group

EXPOSE 5000

CMD ["node", "dist/server.js"]