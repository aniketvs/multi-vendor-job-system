FROM node:18

WORKDIR /app/vendor-sync

COPY vendor-sync/package.json ./

RUN npm install

COPY vendor-sync/ ./
COPY common/ /app/common

EXPOSE 4001

CMD [ "npm" ,"run","dev"]