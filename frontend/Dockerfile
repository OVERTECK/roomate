FROM node:20-alpine AS build

WORKDIR /app

ARG ACCESS_KEY
ARG NEXT_PUBLIC_API_DADATA
ARG NEXT_PUBLIC_MAP_API_KEY
ARG SECRET_KEY
ARG NEXT_PUBLIC_SUGGEST_API_KEY

ENV ACCESS_KEY=$ACCESS_KEY
ENV NEXT_PUBLIC_API_DADATA=$NEXT_PUBLIC_API_DADATA
ENV NEXT_PUBLIC_MAP_API_KEY=$NEXT_PUBLIC_MAP_API_KEY
ENV SECRET_KEY=$SECRET_KEY
ENV NEXT_PUBLIC_SUGGEST_API_KEY=$NEXT_PUBLIC_SUGGEST_API_KEY

COPY package.json package-lock.json* ./

RUN npm ci
COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
