FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

FROM node:22-alpine AS server-build
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/ .

COPY --from=client-build /app/client/build ./client/build

EXPOSE 5000

CMD ["node", "index.js"]
