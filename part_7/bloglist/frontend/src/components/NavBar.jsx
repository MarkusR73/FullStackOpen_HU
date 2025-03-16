import { Link } from 'react-router-dom'

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        Blogs
      </Link>
      <Link to="/users" style={linkStyle}>
        Users
      </Link>
      <span>{user.name} logged in</span>
      <button onClick={handleLogout} style={buttonStyle}>
        Logout
      </button>
    </nav>
  )
}

const navStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#f4f4f4',
  borderBottom: '1px solid #ccc'
}

const linkStyle = {
  textDecoration: 'none',
  color: 'blue',
  fontWeight: 'bold'
}

const buttonStyle = {
  marginLeft: '10px',
  padding: '5px 10px',
  cursor: 'pointer'
}

export default NavBar
