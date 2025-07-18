import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/userSlice'

const Navigation = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div className="navigation">
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      {user ? (
        <span className="user-info">
          <em>{user.name} logged in</em>
          <button onClick={handleLogout} className="logout-btn">
            logout
          </button>
        </span>
      ) : null}
    </div>
  )
}

export default Navigation
