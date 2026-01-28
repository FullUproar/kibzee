#!/bin/bash

# Kibzee Test Runner Script
# This script runs all tests with proper setup and teardown

set -e

echo "🧪 Kibzee Test Suite Runner"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dependencies are installed
echo -e "${YELLOW}Checking dependencies...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm ci
fi

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate

# Run type checking
echo -e "${YELLOW}Running type check...${NC}"
npm run type-check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Type check passed${NC}"
else
    echo -e "${RED}✗ Type check failed${NC}"
    exit 1
fi

# Run linting
echo -e "${YELLOW}Running linter...${NC}"
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Linting passed${NC}"
else
    echo -e "${RED}✗ Linting failed${NC}"
    exit 1
fi

# Run unit tests
echo -e "${YELLOW}Running unit tests...${NC}"
npm run test:unit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Unit tests passed${NC}"
else
    echo -e "${RED}✗ Unit tests failed${NC}"
    exit 1
fi

# Run API tests
echo -e "${YELLOW}Running API tests...${NC}"
npm run test:api
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API tests passed${NC}"
else
    echo -e "${RED}✗ API tests failed${NC}"
    exit 1
fi

# Check if we should run E2E tests
if [ "$1" == "--e2e" ] || [ "$1" == "--all" ]; then
    echo -e "${YELLOW}Installing Playwright browsers...${NC}"
    npx playwright install
    
    echo -e "${YELLOW}Building application...${NC}"
    npm run build
    
    echo -e "${YELLOW}Running E2E tests...${NC}"
    npm run test:e2e
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ E2E tests passed${NC}"
    else
        echo -e "${RED}✗ E2E tests failed${NC}"
        exit 1
    fi
fi

# Generate coverage report
if [ "$1" == "--coverage" ] || [ "$1" == "--all" ]; then
    echo -e "${YELLOW}Generating coverage report...${NC}"
    npm run test:coverage
    echo -e "${GREEN}Coverage report generated in ./coverage${NC}"
fi

echo -e "${GREEN}=========================="
echo -e "✨ All tests passed successfully!${NC}"