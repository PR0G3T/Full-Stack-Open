import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import BlogView from './components/views/BlogView'
import BlogList from './components/views/BlogList'
import Users from './components/views/Users'
import User from './components/views/User'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
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
        <Notification message={notification.message} type={notification.type} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="container">
      <Navigation />
      <Notification message={notification.message} type={notification.type} />
      <h1>Blog app</h1>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>
              <BlogList />
            </div>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </div>
  )
}

export default App
