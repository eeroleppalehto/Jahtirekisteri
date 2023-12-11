FROM node:18.18.0-alpine3.17
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY build/ .
ENV DATABASE_URL="postgresql://application:Q2werty@localhost:5432/dev_metsastys?schema=public"
ENV PORT=3000
RUN npm install --omit=dev
EXPOSE 3000
CMD [ "node", "index.js"]