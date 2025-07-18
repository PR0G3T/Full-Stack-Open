import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationSlice'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      return action.payload
    },
    appendBlog: (state, action) => {
      state.push(action.payload)
    },
    updateBlog: (state, action) => {
      const updatedBlog = action.payload
      return state.map(blog =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    removeBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = blogObject => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch(appendBlog(newBlog))
      dispatch(
        showNotification(
          `A new blog ${newBlog.title} by ${newBlog.author} added`
        )
      )
    } catch (error) {
      dispatch(showNotification('Error creating blog', 'error'))
    }
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      })
      dispatch(updateBlog(updatedBlog))
    } catch (error) {
      dispatch(showNotification('Error updating blog', 'error'))
    }
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    try {
      await blogService.remove(id)
      dispatch(removeBlog(id))
      dispatch(showNotification('Blog deleted successfully'))
    } catch (error) {
      dispatch(showNotification('Error deleting blog', 'error'))
    }
  }
}

export default blogSlice.reducer
