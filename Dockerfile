FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add --no-cache openssl

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev", "--host", "0.0.0.0"]