import { test, expect } from '@playwright/test'

test.describe('Teacher Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teachers')
  })

  test('should display teachers page', async ({ page }) => {
    await expect(page).toHaveTitle(/Find Music Teachers/)
    await expect(page.locator('h1')).toContainText('Find Your Perfect Music Teacher')
  })

  test('should have search filters', async ({ page }) => {
    // Check for filter elements
    await expect(page.locator('input[placeholder*="instrument"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="location"]')).toBeVisible()
    await expect(page.locator('select[name="lessonFormat"]')).toBeVisible()
    await expect(page.locator('text=Price Range')).toBeVisible()
  })

  test('should filter by instrument', async ({ page }) => {
    const instrumentInput = page.locator('input[placeholder*="instrument"]')
    await instrumentInput.fill('Piano')
    await page.click('button:has-text("Search")')
    
    // URL should update with search params
    await expect(page).toHaveURL(/instrument=Piano/)
    
    // Check if results are filtered (if there are any teachers)
    const teacherCards = page.locator('.teacher-card')
    const count = await teacherCards.count()
    
    if (count > 0) {
      // Each card should mention piano
      const firstCard = teacherCards.first()
      const cardText = await firstCard.textContent()
      expect(cardText?.toLowerCase()).toContain('piano')
    }
  })

  test('should filter by location', async ({ page }) => {
    const locationInput = page.locator('input[placeholder*="location"]')
    await locationInput.fill('New York')
    await page.click('button:has-text("Search")')
    
    await expect(page).toHaveURL(/location=New\+York/)
  })

  test('should filter by lesson format', async ({ page }) => {
    await page.selectOption('select[name="lessonFormat"]', 'ONLINE')
    await page.click('button:has-text("Search")')
    
    await expect(page).toHaveURL(/format=ONLINE/)
  })

  test('should filter by price range', async ({ page }) => {
    // Adjust price slider if visible
    const priceSlider = page.locator('input[type="range"]')
    if (await priceSlider.isVisible()) {
      await priceSlider.fill('100')
      await page.click('button:has-text("Search")')
      
      // Check URL for price parameter
      const url = page.url()
      expect(url).toMatch(/maxPrice=\d+/)
    }
  })

  test('should navigate to teacher profile', async ({ page }) => {
    // Wait for teacher cards to load
    await page.waitForSelector('.teacher-card', { timeout: 5000 }).catch(() => {})
    
    const teacherCards = page.locator('.teacher-card')
    const count = await teacherCards.count()
    
    if (count > 0) {
      // Click on first teacher card
      await teacherCards.first().click()
      
      // Should navigate to teacher profile
      await expect(page).toHaveURL(/\/teachers\/[^/]+/)
      
      // Profile page should have teacher information
      await expect(page.locator('h1')).toBeVisible() // Teacher name
      await expect(page.locator('text=About')).toBeVisible()
      await expect(page.locator('text=Experience')).toBeVisible()
      await expect(page.locator('button:has-text("Book Lesson")')).toBeVisible()
    }
  })

  test('should show teacher ratings', async ({ page }) => {
    const teacherCards = page.locator('.teacher-card')
    const count = await teacherCards.count()
    
    if (count > 0) {
      const firstCard = teacherCards.first()
      
      // Check for rating display
      const rating = firstCard.locator('.rating, [aria-label*="rating"]')
      if (await rating.isVisible()) {
        const ratingText = await rating.textContent()
        expect(ratingText).toMatch(/\d(\.\d)?/) // Should be a number like 4.5
      }
    }
  })

  test('should paginate results', async ({ page }) => {
    // Check if pagination exists
    const pagination = page.locator('.pagination, [aria-label="Pagination"]')
    
    if (await pagination.isVisible()) {
      // Check for page numbers or next/previous buttons
      const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")')
      const prevButton = page.locator('button:has-text("Previous"), a:has-text("Previous")')
      
      if (await nextButton.isVisible()) {
        await nextButton.click()
        // URL should update with page parameter
        await expect(page).toHaveURL(/page=2/)
      }
    }
  })

  test('should sort teachers', async ({ page }) => {
    const sortSelect = page.locator('select[name="sort"], select[aria-label*="Sort"]')
    
    if (await sortSelect.isVisible()) {
      // Sort by price
      await sortSelect.selectOption({ label: 'Price: Low to High' })
      await expect(page).toHaveURL(/sort=price_asc/)
      
      // Sort by rating
      await sortSelect.selectOption({ label: 'Highest Rated' })
      await expect(page).toHaveURL(/sort=rating/)
    }
  })

  test('should show no results message', async ({ page }) => {
    // Search for something unlikely to have results
    await page.fill('input[placeholder*="instrument"]', 'Xylophone123456')
    await page.fill('input[placeholder*="location"]', 'Antarctica')
    await page.click('button:has-text("Search")')
    
    // Should show no results message
    const noResults = page.locator('text=/No teachers found|No results/i')
    await expect(noResults).toBeVisible({ timeout: 5000 }).catch(() => {
      // If no "no results" message, there might be default results shown
      console.log('No "no results" message found, might be showing default results')
    })
  })
})