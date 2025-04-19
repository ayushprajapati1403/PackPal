# FROM node:20-alpine AS base

# # Set working directory
# WORKDIR /PackpalApp

# # Install dependencies for the base image
# RUN apk add --no-cache libc6-compat

# # Install pnpm
# RUN npm install -g pnpm

# # Development stage
# FROM base AS development

# # Copy package files
# COPY package.json pnpm-lock.yaml* ./
# COPY project/Frontend/package.json ./project/Frontend/
# COPY project/backend/package.json ./project/backend/
# COPY project/backend/https/package.json ./project/backend/https/
# COPY project/backend/db/package.json ./project/backend/db/

# # Install dependencies
# RUN pnpm install

# # Copy source code
# COPY . .

# # Expose ports
# EXPOSE 5173 3000

# # Start development servers
# CMD ["pnpm", "run", "dev"]

# # Production stage
# FROM base AS production

# # Copy package files
# COPY package.json pnpm-lock.yaml* ./
# COPY project/Frontend/package.json ./project/Frontend/
# COPY project/backend/package.json ./project/backend/
# COPY project/backend/https/package.json ./project/backend/https/
# COPY project/backend/db/package.json ./project/backend/db/

# # Install dependencies
# RUN pnpm install --prod

# # Copy source code
# COPY . .

# # Build frontend and backend
# RUN cd project/Frontend && pnpm run build
# RUN cd project/backend && pnpm run build

# # Expose ports
# EXPOSE 3000

# # Start production server
# CMD ["cd", "project/backend", "&&", "node", "dist/https/src/index.js"]
