FROM node:18

WORKDIR /app/api

COPY api/package.json ./

RUN npm install

COPY api/ ./
COPY common/ /app/common

EXPOSE 3000

CMD ["npm", "run", "dev"]
