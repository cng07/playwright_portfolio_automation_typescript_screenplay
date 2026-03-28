FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and tests
COPY src ./src
COPY tests ./tests
COPY playwright.config.ts .

# Create report directories
RUN mkdir -p test-results

# Set environment variable for CI
ENV CI=true

# Run tests
CMD ["npx", "playwright", "test"]
