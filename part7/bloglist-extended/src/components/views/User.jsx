import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../../services/users'

const User = () => {
  const [user, setUser] = useState(null)
  const id = useParams().id

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await userService.getAll()
        const foundUser = users.find(u => u.id === id)
        setUser(foundUser)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [id])

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs && user.blogs.length > 0 ? (
          user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)
        ) : (
          <li>No blogs added yet</li>
        )}
      </ul>
    </div>
  )
}

export default User
