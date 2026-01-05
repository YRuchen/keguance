# Stage 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build -- --mode ${NODE_ENV}

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm -rf /etc/nginx/nginx.conf && rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/
COPY portal.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
