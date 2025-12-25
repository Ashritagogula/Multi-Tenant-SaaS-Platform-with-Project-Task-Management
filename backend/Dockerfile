FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client curl

COPY src/package*.json ./src/
RUN cd src && npm install

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 5000

CMD ["sh", "entrypoint.sh"]
