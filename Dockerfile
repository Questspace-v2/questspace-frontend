FROM node:21.6.2-alpine as deps
WORKDIR /questspace-frontend
COPY package*.json .
RUN npm install

FROM node:21.6.2-alpine as builder
WORKDIR /questspace-frontend
COPY --from=deps /questspace-frontend/node_modules ./node_modules
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY package.json next.config.js tsconfig.json ./
RUN npm run build

FROM node:21.6.2-alpine
WORKDIR /questspace-frontend
COPY --from=builder /questspace-frontend/.next ./.next
COPY --from=builder /questspace-frontend/public ./public
COPY --from=builder /questspace-frontend/node_modules ./node_modules
COPY --from=builder /questspace-frontend/package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]