# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app/api

# Copy only package.json first to cache deps
COPY api/package.json ./

# Install dependencies
RUN npm install

# Copy remaining source code
COPY api/ ./
COPY common/ /app/common

# Expose the port
EXPOSE 3000

# Start dev server with nodemon
CMD ["npm", "run", "dev"]
