FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY . .
ENV PORT=4000
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/index.js"]
