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
ARG PORT
ENV PORT=${PORT}
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG SITE_URL
ENV SITE_URL=${SITE_URL}

#I will use postgres configuration
ARG DB_PORT
ENV DB_PORT=${DB_PORT}
ARG DB_USERNAME
ENV DB_USERNAME=${DB_USERNAME}
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
ARG DB_NAME
ENV DB_NAME=${DB_NAME}
ARG DB_HOST
ENV DB_HOST=${DB_HOST}
ARG DB_DIALECT
ENV DB_DIALECT=${DB_DIALECT}


#fill your jwt secret key with random string or encoded string
ARG JWT_ACCESS_TOKEN_SECRET
ENV JWT_ACCESS_TOKEN_SECRET=${JWT_ACCESS_TOKEN_SECRET}
ARG JWT_REFRESH_TOKEN_SECRET
ENV JWT_EXPIRES_IN=${JWT_ACCESS_TOKEN_SECRET}

# email configuration
ARG EMAIL_USER
ENV EMAIL_USER=${EMAIL_USER}
ARG EMAIL_PASS
ENV EMAIL_PASS=${EMAIL_PASS}

#Cloudinary
ARG CLOUDINARY_API_KEY
ENV CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
ARG CLOUDINARY_API_SECRET
ENV CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
ARG CLOUDINARY_NAME
ENV CLOUDINARY_NAME=${CLOUDINARY_NAME}

EXPOSE 5000

CMD ["node", "dist/server.js"]