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
# DB_PORT = 10504
# DB_USERNAME = avnadmin
# DB_PASSWORD = AVNS_KGoAXJMO2xeqTCKpiGt
# DB_NAME = defaultdb
# DB_HOST = fball-db-johnson-test.g.aivencloud.com
# DB_DIALECT = postgres 
# DB_SSL_MODE = require
# DB_CA_CERTIFICATE=-----BEGIN CERTIFICATE-----
# MIIEQTCCAqmgAwIBAgIUYs+U1Q1ovG3b+BYaztvXn3X6PwkwDQYJKoZIhvcNAQEM
# BQAwOjE4MDYGA1UEAwwvN2ViNTY0ODktMjFlNi00ZWFiLWI4YzQtY2JlNGE2OGQx
# OWIxIFByb2plY3QgQ0EwHhcNMjUwMTI4MDgzNzMzWhcNMzUwMTI2MDgzNzMzWjA6
# MTgwNgYDVQQDDC83ZWI1NjQ4OS0yMWU2LTRlYWItYjhjNC1jYmU0YTY4ZDE5YjEg
# UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAM+Ev4av
# mnsPdoFzdFoncr5s5JDmydXTQPYk1WO3+aiTQ/NIJc81LqKrPym0eiUpVEpctlRI
# iac9AHwp4gh8ASiD3umXu8ydXP8V7lDi0Fy22adHH4xhHaymjvZBEKnQPBtWaV/M
# L529IKL8/9sbcKcytjRzUNywY20xUGzPE0iClwq67FHlrgeiP+DSpa+44VlSrpOK
# GYoKK8Q4El8r6MpCSJmkpye8pOHYW2vEUN1os9dh1YlwF9LZsqdypxss5/GkE9OU
# 0wqxtnc61CbG4sE1X6h6IDE/A8brjkuY5oWgnMRTr4qLZti8nf9Aavk/rf6RvlIS
# QOCHhUOdOJ9xauZM4XG/y+a82+juwyrC/HETRTyZFu/roW0+Jf3KbCfTfFIKCEuK
# XtfKDtY9fZXaMYHLuUx9RaHgX/bV53dRSf1ZyDlTphUhdEtX8QKLcikf/g8jiEf+
# IGLFjWdpQMAQvrTqocby7KWfYLhgFeK42ezkQ2V59Tmd75vDT9m6iWbihQIDAQAB
# oz8wPTAdBgNVHQ4EFgQUH9BgMVagPaSDK3ZC3ulAxoSOPRIwDwYDVR0TBAgwBgEB
# /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAGWjyhlB+21CirP5
# AYTz8kBElbSHyNVeoo+mV9EGMElvLM+V8/HjQCO6VfmGsyXeceFV3aVg4K5SpDyh
# 1YKpWIUg4fPM9GSlj2IFKQrbrFwh+LG1OBgYwIQCiYf5b3AeyUIiqLJwGhOEcqn6
# kfemBWieU0rwtIvmyjlcwM87pNXlsWJ4+e/xwYItc8L/ePG1J0lEF7kLamYpnoXQ
# aZnf5Udr5hdBgxjeW/glt/9C7UpLYapMmK5thcvdj9+imqTwehd0VIt1FE1OpKuf
# CENP+bw77cnOhdsbMQTiMbxmhrXPPSLVl3s0N8o6MvUb/JUxBG1cRTD0ijcZz2mU
# BCRqYqKBt5XxMGvEltIgurgpXNoEH8ocDW67nAL23CXZ0FAnsKVvI0ws3jf98vRR
# 4ess6qgrW58tTKSMZeCYayJk753mJ3kr0T7KzFoNVqklCc2MGEw0pmrMAJUXJAJl
# x1uanPD6Ib37e3TgelhGOxwcfNzThDCJ4zHJBfQBMrnQeApXYQ==
# -----END CERTIFICATE-----

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