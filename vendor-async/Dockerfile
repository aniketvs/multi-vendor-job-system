FROM node:18

WORKDIR /app/vendor-async

COPY vendor-async/package.json ./

RUN npm install

COPY vendor-async/ ./
COPY common/ /app/common

EXPOSE 4002

CMD [ "npm" ,"run","dev"]