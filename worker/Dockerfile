FROM node:18

WORKDIR /app/worker

COPY worker/package.json ./

RUN npm install

COPY worker/ ./
COPY common/ /app/common

CMD ["npm", "run", "dev"]