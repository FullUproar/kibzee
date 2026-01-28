import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the launch banner', async ({ page }) => {
    const banner = page.locator('.bg-gradient-to-r.from-sage.to-clay')
    await expect(banner).toBeVisible()
    await expect(banner).toContainText('Coming September 2025')
  })

  test('should display the hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Find Your Perfect Music Teacher')
    await expect(page.locator('text=Connect with passionate music teachers')).toBeVisible()
  })

  test('should have search functionality', async ({ page }) => {
    // Check search form elements
    const instrumentInput = page.locator('input[placeholder*="instrument"]')
    const locationInput = page.locator('input[placeholder*="city"]')
    const searchButton = page.locator('button:has-text("Search Teachers")')
    
    await expect(instrumentInput).toBeVisible()
    await expect(locationInput).toBeVisible()
    await expect(searchButton).toBeVisible()
    
    // Try searching
    await instrumentInput.fill('Piano')
    await locationInput.fill('New York')
    await searchButton.click()
    
    // Should navigate to teachers page with search params
    await expect(page).toHaveURL(/\/teachers\?instrument=Piano&location=New\+York/)
  })

  test('should display features section', async ({ page }) => {
    const features = [
      'Verified Teachers',
      'Flexible Scheduling',
      'Secure Payments',
      'Progress Tracking'
    ]
    
    for (const feature of features) {
      await expect(page.locator(`text=${feature}`)).toBeVisible()
    }
  })

  test('should have navigation links', async ({ page }) => {
    // Check main navigation
    await expect(page.locator('nav a:has-text("Find Teachers")')).toBeVisible()
    await expect(page.locator('nav a:has-text("How It Works")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Sign In")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Sign Up")')).toBeVisible()
  })

  test('should navigate to teachers page', async ({ page }) => {
    await page.click('nav a:has-text("Find Teachers")')
    await expect(page).toHaveURL('/teachers')
  })

  test('should have teacher sign up CTA', async ({ page }) => {
    const teacherCTA = page.locator('a:has-text("Sign up as a teacher")')
    await expect(teacherCTA).toBeVisible()
    
    await teacherCTA.click()
    await expect(page).toHaveURL('/auth/signup?role=teacher')
  })

  test('should display popular instruments', async ({ page }) => {
    const instruments = ['Piano', 'Guitar', 'Violin', 'Voice', 'Drums']
    
    for (const instrument of instruments) {
      const instrumentCard = page.locator(`.cursor-pointer:has-text("${instrument}")`)
      await expect(instrumentCard).toBeVisible()
    }
  })

  test('should have responsive design', async ({ page, viewport }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Hero should still be visible
    await expect(page.locator('h1')).toBeVisible()
    
    // Navigation might be in hamburger menu
    const mobileMenu = page.locator('button[aria-label*="menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      await expect(page.locator('nav a:has-text("Find Teachers")')).toBeVisible()
    }
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('h1')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('h1')).toBeVisible()
  })
})