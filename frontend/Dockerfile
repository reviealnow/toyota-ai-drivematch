FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
ARG API_URL=http://backend:8000
ENV API_URL=$API_URL
RUN npm run build
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 API_URL=http://backend:8000
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "run", "start"]
