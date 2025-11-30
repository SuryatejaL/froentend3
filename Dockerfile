FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY server.js ./
COPY data ./data
COPY build ./build
EXPOSE 5000
CMD ["node", "server.js"]
