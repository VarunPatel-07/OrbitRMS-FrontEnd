# ---------------------------
# 1. Builder Stage
# ---------------------------

FROM node:24-alpine AS builder

WORKDIR /orbitRMS

# Install required OS packages
RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


COPY . .


RUN pnpm build





# ---------------------------
# 2. Runner Stage (lightweight)
# ---------------------------

FROM node:24-alpine AS runner


WORKDIR /orbitRMS

RUN npm install -g pnpm

COPY --from=builder /orbitRMS/dist ./dist
COPY --from=builder /orbitRMS/node_modules ./node_modules
COPY --from=builder /orbitRMS/package.json .
COPY --from=builder /orbitRMS/pnpm-lock.yaml .

EXPOSE 4173

CMD ["pnpm", "preview", "--host"]