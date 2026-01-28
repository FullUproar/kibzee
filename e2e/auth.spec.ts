import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show sign in page', async ({ page }) => {
    await page.goto('/auth/signin')
    
    await expect(page).toHaveTitle(/Sign In/)
    await expect(page.locator('h1')).toContainText('Sign in to your account')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In')
  })

  test('should show sign up page with role selection', async ({ page }) => {
    await page.goto('/auth/signup')
    
    await expect(page.locator('h1')).toContainText('Create your account')
    await expect(page.locator('button:has-text("I\'m a Student")')).toBeVisible()
    await expect(page.locator('button:has-text("I\'m a Teacher")')).toBeVisible()
  })

  test('should navigate between sign in and sign up', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Click on sign up link
    await page.click('text=Don\'t have an account? Sign up')
    await expect(page).toHaveURL('/auth/signup')
    
    // Go back to sign in
    await page.click('text=Already have an account? Sign in')
    await expect(page).toHaveURL('/auth/signin')
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Check for browser validation messages
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    
    await expect(emailInput).toHaveAttribute('required', '')
    await expect(passwordInput).toHaveAttribute('required', '')
  })

  test('should handle student sign up flow', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Select student role
    await page.click('button:has-text("I\'m a Student")')
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test Student')
    await page.fill('input[name="email"]', `test.student.${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'TestPassword123!')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to onboarding or dashboard
    await page.waitForURL((url) => 
      url.pathname === '/onboarding/student' || 
      url.pathname === '/dashboard',
      { timeout: 10000 }
    )
  })

  test('should handle teacher sign up flow', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Select teacher role
    await page.click('button:has-text("I\'m a Teacher")')
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', `test.teacher.${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'TestPassword123!')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to onboarding or dashboard
    await page.waitForURL((url) => 
      url.pathname === '/onboarding/teacher' || 
      url.pathname === '/dashboard',
      { timeout: 10000 }
    )
  })

  test('should protect dashboard route', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard')
    
    // Should redirect to sign in
    await expect(page).toHaveURL('/auth/signin')
  })
})