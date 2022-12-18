FROM node:latest as build-stage

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Build the app
COPY ./ .
RUN yarn build

FROM nginx as production-stage

# Copy the built files from the build stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf