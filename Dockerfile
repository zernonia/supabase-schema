FROM node:latest as build-stage

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Build the app
COPY ./ .
RUN yarn build


# Pack import-meta-env in a binary
RUN npx pkg ./node_modules/@import-meta-env/cli/bin/import-meta-env.js \
  --target node18-alpine-x64 \
  --output /app/dist/import-meta-env-alpine


FROM nginx:1.23.3-alpine as production-stage

# Copy the built files from the build stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/.env.example /app/dist/import-meta-env-alpine /app

# define env variables defaults
ENV SUPABASE_ANON_KEY=
ENV SUPABASE_API_URL=


# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy import-meta-env injection script 
# Placed the last to be executed in /docker-entrypoint.d by /docker-entrypoint.sh
COPY 40-import-meta-env.sh /docker-entrypoint.d