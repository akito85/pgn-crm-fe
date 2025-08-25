# # Use official Node.js image as the base image
# FROM node:14-alpine
#
# # Set the working directory in the container
# WORKDIR /app
#
# # Copy package.json and yarn.lock to the working directory
# COPY package.json yarn.lock ./
#
# # Install dependencies using Yarn
# RUN yarn install
#
# # Copy the rest of the application code
# COPY . .
#
# CMD ["yarn", "start"]
FROM nginx:alpine
COPY ./build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf