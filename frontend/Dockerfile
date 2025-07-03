FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set the environment to production
ENV NODE_ENV=production
ENV REACT_APP_AUTH_API_URL=http://localhost:3001/auth
ENV REACT_APP_TASK_API_URL=http://localhost:3002/tasks

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
