import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../../store/blogSlice'

const BlogView = () => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const dispatch = useDispatch()
  const id = useParams().id
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return null
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
    }
  }

  const handleCommentSubmit = async event => {
    event.preventDefault()
    setComments([...comments, newComment])
    setNewComment('')
  }

  const showDeleteButton =
    blog.user &&
    user &&
    (blog.user.username === user.username ||
      blog.user.id === user.id ||
      blog.user === user.id)

  return (
    <div className="blog-detail">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div className="blog-meta">
        <div>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </div>
        <div>
          {blog.likes} likes{' '}
          <button onClick={handleLike} className="btn btn-secondary">
            like
          </button>
        </div>
        <div>added by {blog.user?.name}</div>
        {showDeleteButton && (
          <button onClick={handleDelete} className="btn btn-danger">
            remove
          </button>
        )}
      </div>

      <div className="comments">
        <h3>comments</h3>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" className="btn">
            add comment
          </button>
        </form>
        <ul className="comment-list">
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogView
