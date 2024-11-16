FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add --no-cache openssl

COPY package.json ./
RUN npm install

RUN mkdir -p /app/cert && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /app/cert/cert.key -out /app/cert/cert.crt \
    -subj "/CN=localhost"

COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--https", "--cert", "/app/cert/cert.crt", "--key", "/app/cert/cert.key", "--host", "0.0.0.0"]

