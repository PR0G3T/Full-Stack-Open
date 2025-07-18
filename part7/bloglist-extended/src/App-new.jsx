import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from './store/blogSlice'
import { initializeUser, loginUser, logoutUser } from './store/userSlice'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async loginObject => {
    dispatch(loginUser(loginObject))
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const addBlog = async blogObject => {
    dispatch(createBlog(blogObject))
    blogFormRef.current.toggleVisibility()
  }

  const updateBlog = async (id, blogObject) => {
    dispatch(likeBlog(blogObject))
  }

  const handleDeleteBlog = async id => {
    dispatch(deleteBlog(id))
  }

  if (user === null) {
    return (
      <div>
        <Notification
          message={notification.message}
          type={notification.type}
        />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={handleDeleteBlog}
            user={user}
          />
        ))}
    </div>
  )
}

export default App
