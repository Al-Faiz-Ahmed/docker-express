FROM node:24.12.0-alpine3.23

RUN apk add bash
RUN apk add curl
RUN apk add vim

RUN npm install -g npm@11.7.0 typescript@5.9.3 pnpm@10.26.2

WORKDIR /app

COPY package.json ./

RUN pnpm install

CMD ["bash","-c", "echo 'Container Ready Use npm run dev to start'; tail -f /dev/null "]