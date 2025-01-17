FROM node:20-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY --from=build /app/dist ./dist
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]
