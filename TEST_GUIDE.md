# Kibzee Testing Guide

## Overview

This guide covers the testing setup and strategies for the Kibzee platform. We use a comprehensive testing approach including unit tests, integration tests, and end-to-end (E2E) tests.

## Testing Stack

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **GitHub Actions**: CI/CD pipeline

## Test Structure

```
kibzee/
├── src/
│   ├── components/__tests__/    # Component unit tests
│   ├── lib/__tests__/           # Library unit tests
│   └── app/api/__tests__/       # API integration tests
├── e2e/                         # E2E test scenarios
├── test/setup/                  # Test setup utilities
└── coverage/                    # Coverage reports (generated)
```

## Running Tests

### Quick Start

```bash
# Install dependencies
npm install

# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:unit      # Unit tests only
npm run test:api       # API tests only
npm run test:e2e       # E2E tests

# Run all tests with coverage
npm run test:coverage

# Run the complete test suite
npm run test:all
```

### Using the Test Runner Script

```bash
# Make the script executable (Unix/Mac)
chmod +x scripts/run-tests.sh

# Run basic tests
./scripts/run-tests.sh

# Run all tests including E2E
./scripts/run-tests.sh --all

# Run with coverage report
./scripts/run-tests.sh --coverage
```

## Test Types

### 1. Unit Tests

Unit tests focus on individual components and functions in isolation.

**Example:**
```typescript
// src/components/__tests__/hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/hero'

describe('Hero Component', () => {
  it('renders the hero section', () => {
    render(<Hero />)
    expect(screen.getByText(/Find Your Perfect Music Teacher/)).toBeInTheDocument()
  })
})
```

**Run:** `npm run test:unit`

### 2. Integration Tests

Integration tests verify that different parts of the application work together correctly.

**Example:**
```typescript
// src/app/api/__tests__/bookings.test.ts
describe('/api/bookings', () => {
  it('creates a new booking', async () => {
    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(prisma.booking.create).toHaveBeenCalled()
  })
})
```

**Run:** `npm run test:api`

### 3. E2E Tests

E2E tests simulate real user interactions with the application.

**Example:**
```typescript
// e2e/booking-flow.spec.ts
test('should complete booking flow', async ({ page }) => {
  await page.goto('/teachers')
  await page.click('.teacher-card:first-child')
  await page.click('button:has-text("Book Lesson")')
  // ... complete booking steps
})
```

**Run:** `npm run test:e2e`

## Test Database Setup

### Local Development

1. Create a test database:
```bash
createdb kibzee_test
```

2. Set up environment variables in `.env.test`:
```env
PRISMA_DATABASE_URL="postgresql://user:pass@localhost:5432/kibzee_test"
```

3. Run migrations:
```bash
DATABASE_URL=$PRISMA_DATABASE_URL npx prisma migrate deploy
```

4. Seed test data:
```bash
npm run db:seed
```

### CI Environment

The CI pipeline automatically sets up a PostgreSQL service for testing. See `.github/workflows/ci.yml` for configuration.

## Writing Tests

### Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the component/function does, not how it does it
   - Test user interactions and outcomes

2. **Use Descriptive Test Names**
   ```typescript
   describe('BookingForm', () => {
     it('should display error when required fields are empty', () => {})
     it('should calculate total price based on duration', () => {})
   })
   ```

3. **Follow AAA Pattern**
   - **Arrange**: Set up test data and conditions
   - **Act**: Execute the code being tested
   - **Assert**: Verify the results

4. **Mock External Dependencies**
   ```typescript
   jest.mock('@/lib/prisma')
   jest.mock('@/lib/stripe')
   ```

5. **Clean Up After Tests**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks()
   })
   ```

### Testing Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('handles user input', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)
  
  const input = screen.getByRole('textbox')
  await user.type(input, 'test value')
  
  expect(input).toHaveValue('test value')
})
```

### Testing API Routes

```typescript
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/bookings/route'

test('creates booking', async () => {
  const request = new NextRequest('http://localhost:3000/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ /* data */ })
  })
  
  const response = await POST(request)
  expect(response.status).toBe(200)
})
```

### Testing with Playwright

```typescript
import { test, expect } from '@playwright/test'

test('user can book a lesson', async ({ page }) => {
  // Navigate to page
  await page.goto('/teachers')
  
  // Interact with elements
  await page.click('button:has-text("Book Now")')
  
  // Assert results
  await expect(page).toHaveURL('/booking/confirm')
})
```

## Coverage Reports

Generate and view coverage reports:

```bash
# Generate coverage
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Targets

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## CI/CD Pipeline

### GitHub Actions Workflow

The CI pipeline runs on every push and pull request:

1. **Lint and Type Check**: Ensures code quality
2. **Unit Tests**: Tests components and utilities
3. **Integration Tests**: Tests API endpoints
4. **E2E Tests**: Tests user workflows
5. **Build**: Verifies production build
6. **Deploy**: Deploys to Vercel (main branch only)

### Running CI Locally

```bash
# Install act (GitHub Actions local runner)
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash  # Linux

# Run CI workflow locally
act push
```

## Debugging Tests

### Jest Tests

```bash
# Run tests in debug mode
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Run specific test file
npm test -- booking-form.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should create booking"
```

### Playwright Tests

```bash
# Run with UI mode
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run with specific browser
npx playwright test --project=chromium
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env.test`
   - Run migrations: `npx prisma migrate deploy`

2. **Playwright Browser Issues**
   - Install browsers: `npx playwright install`
   - Update browsers: `npx playwright install --force`

3. **Module Resolution Errors**
   - Clear Jest cache: `jest --clearCache`
   - Regenerate Prisma client: `npx prisma generate`

4. **Test Timeouts**
   - Increase timeout in test:
     ```typescript
     test('slow test', async () => {
       jest.setTimeout(10000)
       // test code
     })
     ```

## Test Data Management

### Seeding Test Data

```bash
# Run seed script
npm run db:seed

# Reset and reseed
npm run db:reset && npm run db:seed
```

### Test User Credentials

Default test users created by seed script:

- **Admin**: admin@kibzee.com / admin123
- **Student**: test.student@example.com / test123
- **Teacher**: test.teacher@example.com / test123

## Continuous Improvement

### Adding New Tests

When adding new features:

1. Write unit tests for new components/functions
2. Add integration tests for new API endpoints
3. Create E2E tests for new user workflows
4. Update this guide with any new testing patterns

### Performance Testing

For performance-critical paths:

```typescript
test('renders large list efficiently', async () => {
  const startTime = performance.now()
  render(<LargeList items={generateItems(1000)} />)
  const endTime = performance.now()
  
  expect(endTime - startTime).toBeLessThan(100) // ms
})
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions](https://docs.github.com/en/actions)

## Support

For testing-related questions or issues:

1. Check this guide
2. Review existing tests for examples
3. Open an issue on GitHub
4. Contact the development team