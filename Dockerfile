FROM node:16-alpine as builder

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./src

# installing deps
RUN yarn

# Compiling project
RUN yarn build

# Deploy
FROM node:16-alpine as production

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY --from=builder /app/build /app/build

# Installing deps
RUN yarn --production

EXPOSE 8080
CMD ["npm", "start"]