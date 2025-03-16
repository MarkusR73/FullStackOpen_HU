import { Link } from 'react-router-dom'
import '../styles/navbar.css'

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        Blogs
      </Link>
      <Link to="/users" className="nav-link">
        Users
      </Link>
      <span>{user.name} logged in</span>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  )
}

export default NavBar
