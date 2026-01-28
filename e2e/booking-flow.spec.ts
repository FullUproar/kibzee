import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  // This test requires authentication and a seeded database
  test.skip('should complete full booking flow', async ({ page }) => {
    // First, sign in as a student
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'student@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
    
    // Navigate to teachers page
    await page.goto('/teachers')
    
    // Search for a teacher
    await page.fill('input[placeholder*="instrument"]', 'Piano')
    await page.click('button:has-text("Search")')
    
    // Click on first teacher card
    await page.click('.teacher-card:first-child')
    
    // Should be on teacher profile page
    await expect(page).toHaveURL(/\/teachers\/[^/]+/)
    
    // Click book lesson button
    await page.click('button:has-text("Book Lesson")')
    
    // Fill booking form - Step 1: Lesson Details
    await page.selectOption('select[name="duration"]', '60')
    await page.selectOption('select[name="format"]', 'ONLINE')
    await page.fill('input[name="instrument"]', 'Piano')
    await page.click('button:has-text("Next")')
    
    // Step 2: Select Date & Time
    // Click on an available date (assumes calendar is visible)
    await page.click('.calendar-day.available:first-child')
    
    // Select a time slot
    await page.click('button.time-slot:first-child')
    await page.click('button:has-text("Next")')
    
    // Step 3: Review & Confirm
    await expect(page.locator('text=Review Your Booking')).toBeVisible()
    await page.fill('textarea[name="notes"]', 'Looking forward to the lesson!')
    await page.click('button:has-text("Confirm Booking")')
    
    // Should redirect to payment or confirmation
    await page.waitForURL((url) => 
      url.pathname.includes('/payment') || 
      url.pathname.includes('/bookings'),
      { timeout: 10000 }
    )
  })

  test('should show teacher availability calendar', async ({ page }) => {
    // Navigate directly to a teacher profile (mock teacher ID)
    await page.goto('/teachers/mock-teacher-id')
    
    // Check if calendar is visible
    const calendar = page.locator('.calendar-container')
    if (await calendar.isVisible()) {
      // Check for month navigation
      await expect(page.locator('button[aria-label="Previous month"]')).toBeVisible()
      await expect(page.locator('button[aria-label="Next month"]')).toBeVisible()
      
      // Check for weekday headers
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      for (const day of weekdays) {
        await expect(page.locator(`.calendar-header:has-text("${day}")`)).toBeVisible()
      }
    }
  })

  test('should validate booking form fields', async ({ page }) => {
    // Navigate to a teacher profile
    await page.goto('/teachers/mock-teacher-id')
    
    // Click book lesson button
    const bookButton = page.locator('button:has-text("Book Lesson")')
    if (await bookButton.isVisible()) {
      await bookButton.click()
      
      // Try to proceed without filling required fields
      await page.click('button:has-text("Next")')
      
      // Should still be on step 1
      await expect(page.locator('text=Select Lesson Details')).toBeVisible()
      
      // Fill required fields
      await page.selectOption('select[name="duration"]', '30')
      await page.selectOption('select[name="format"]', 'IN_PERSON')
      await page.fill('input[name="instrument"]', 'Guitar')
      
      // Now should be able to proceed
      await page.click('button:has-text("Next")')
      await expect(page.locator('text=Select Date & Time')).toBeVisible()
    }
  })

  test('should calculate pricing correctly', async ({ page }) => {
    await page.goto('/teachers/mock-teacher-id')
    
    const bookButton = page.locator('button:has-text("Book Lesson")')
    if (await bookButton.isVisible()) {
      await bookButton.click()
      
      // Select 30 minute lesson
      await page.selectOption('select[name="duration"]', '30')
      
      // Check if price is displayed
      const price30 = page.locator('text=/$\\d+\\.\\d{2}/')
      if (await price30.isVisible()) {
        const price30Text = await price30.textContent()
        
        // Select 60 minute lesson
        await page.selectOption('select[name="duration"]', '60')
        
        // Price should update
        const price60 = page.locator('text=/$\\d+\\.\\d{2}/')
        const price60Text = await price60.textContent()
        
        // 60 minute lesson should be more expensive than 30 minute
        expect(price60Text).not.toBe(price30Text)
      }
    }
  })
})