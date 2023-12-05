# FROM node:18.18.0-alpine3.17
# RUN mkdir -p /home/node/app
# WORKDIR /home/node/app
# COPY package*.json prisma/ ./
# RUN npm install --omit=dev
# COPY build/ .
# EXPOSE 8080
# CMD [ "npm", "start"]

FROM node:18.18.0-alpine3.17
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY build/ .
RUN npm install --omit=dev
EXPOSE 8080
CMD [ "npm", "start"]