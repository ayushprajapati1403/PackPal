FROM node:18

WORKDIR /app

# Copy package files and TypeScript configurations
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Start the development server with --host to expose it
CMD ["npm", "run", "dev", "--", "--host"]
