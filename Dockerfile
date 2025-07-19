FROM --platform=linux/amd64 node:24-alpine

WORKDIR /orbitRMS

COPY . .

RUN npm install -g pnpm && pnpm install --frozen-lockfile 

RUN pnpm build

EXPOSE 4173

CMD ["pnpm", "preview", "--host"]