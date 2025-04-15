# Use an official Node runtime as a parent image
FROM node:22-alpine

# Create and set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# If your project needs to be built (for example, a React app inside "client"),
# then add a build step here, e.g.:
# WORKDIR /app/client
# RUN npm install && npm run build
# WORKDIR /app

# Expose the port that the app listens on (Fly.io defaults to port 8080)
EXPOSE 8080

# Set environment variable for production (if needed)
ENV NODE_ENV=production

# Define the command to run your app (adjust as needed)
CMD ["node", "server.js"]
