import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    id: '123',
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testing-library.com',
    likes: 5,
    user: {
      id: 'user123',
      username: 'testuser',
      name: 'Test User',
    },
  }

  const user = {
    id: 'user123',
    username: 'testuser',
    name: 'Test User',
  }

  const mockUpdateBlog = vi.fn()
  const mockDeleteBlog = vi.fn()

  beforeEach(() => {
    mockUpdateBlog.mockClear()
    mockDeleteBlog.mockClear()
  })

  test('renders title and author but not URL or likes by default', () => {
    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        user={user}
      />
    )

    const titleAuthor = screen.getByText(
      'Component testing is done with react-testing-library Test Author'
    )
    expect(titleAuthor).toBeDefined()

    const url = screen.queryByText('https://testing-library.com')
    expect(url).toBeNull()

    const likes = screen.queryByText('likes 5')
    expect(likes).toBeNull()
  })

  test('URL and likes are shown when view button is clicked', async () => {
    const userEvent = userEvent.setup()

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        user={user}
      />
    )

    const viewButton = screen.getByText('view')
    await userEvent.click(viewButton)

    const url = screen.getByText('https://testing-library.com')
    expect(url).toBeDefined()

    const likes = screen.getByText('likes 5')
    expect(likes).toBeDefined()
  })

  test('like button event handler is called twice when clicked twice', async () => {
    const userEvent = userEvent.setup()

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        user={user}
      />
    )

    const viewButton = screen.getByText('view')
    await userEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  })
})
