# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and tsconfig from https subfolder
COPY package*.json ./
COPY tsconfig.json ./

COPY prisma ./prisma


# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy full source code into the container

RUN npx prisma generate 

COPY . .



# Build the project (if needed)


# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
