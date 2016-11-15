FROM node:4.4.1-slim

RUN mkdir -p /home/dev/log
RUN mkdir -p /home/dev/uploads

WORKDIR /home/dev

COPY /node_modules /home/dev/node_modules
COPY /src /home/dev/src

CMD ["node", "./src/server.js"]

