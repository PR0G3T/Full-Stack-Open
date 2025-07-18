const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post('http://localhost:3003/api/testing/reset')

    // Create a user for the backend
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.notification')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').first().fill('a blog created by playwright')
      await page.getByRole('textbox').nth(1).fill('Playwright Author')
      await page.getByRole('textbox').last().fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('a blog created by playwright Playwright Author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByRole('textbox').first().fill('a blog created by playwright')
        await page.getByRole('textbox').nth(1).fill('Playwright Author')
        await page.getByRole('textbox').last().fill('http://playwright.dev')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('a blog created by playwright Playwright Author').waitFor()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('the user who added the blog can delete the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        
        await expect(page.getByText('a blog created by playwright Playwright Author')).not.toBeVisible()
      })

      test('only the user who added the blog sees the delete button', async ({ page, request }) => {
        // Create another user
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Another User',
            username: 'anotheruser',
            password: 'password'
          }
        })

        // Logout current user
        await page.getByRole('button', { name: 'logout' }).click()

        // Login as the other user
        await page.getByRole('textbox').first().fill('anotheruser')
        await page.getByRole('textbox').last().fill('password')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        // Create first blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByRole('textbox').first().fill('The title with the most likes')
        await page.getByRole('textbox').nth(1).fill('Author 1')
        await page.getByRole('textbox').last().fill('http://example1.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('The title with the most likes Author 1').waitFor()

        // Create second blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByRole('textbox').first().fill('The title with the second most likes')
        await page.getByRole('textbox').nth(1).fill('Author 2')
        await page.getByRole('textbox').last().fill('http://example2.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('The title with the second most likes Author 2').waitFor()
      })

      test('blogs are arranged in the order according to likes', async ({ page }) => {
        // Like the second blog more than the first
        const blogs = await page.locator('.blog').all()
        
        // Like the second blog (index 1) 3 times
        await blogs[1].getByRole('button', { name: 'view' }).click()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 1').waitFor()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 2').waitFor()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 3').waitFor()

        // Like the first blog (index 0) 1 time
        await blogs[0].getByRole('button', { name: 'view' }).click()
        await blogs[0].getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 1').waitFor()

        // Reload page to see if the sorting is maintained
        await page.reload()

        // Check that the blog with more likes is first
        const sortedBlogs = await page.locator('.blog').all()
        await expect(sortedBlogs[0]).toContainText('The title with the second most likes')
        await expect(sortedBlogs[1]).toContainText('The title with the most likes')
      })
    })
  })
})
