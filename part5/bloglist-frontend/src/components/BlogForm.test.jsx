import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  test('calls event handler with correct details when new blog is created', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={mockCreateBlog} />)

    // Find the input fields by their names
    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs.find(input => input.name === 'Title')
    const authorInput = inputs.find(input => input.name === 'Author')
    const urlInput = inputs.find(input => input.name === 'Url')
    const createButton = screen.getByText('create')

    // Fill in the form
    await user.type(titleInput, 'Testing forms with react-testing-library')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://testing.com')

    // Submit the form
    await user.click(createButton)

    // Check that createBlog was called with correct parameters
    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Testing forms with react-testing-library',
      author: 'Test Author',
      url: 'https://testing.com'
    })
  })
})
