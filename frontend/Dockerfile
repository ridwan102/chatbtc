FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Set environment variables
ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]