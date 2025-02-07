import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: 'Login successful!', type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    } catch (exception) {
      setNotification({ message: 'Wrong username or password!', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setNotification({ message: 'Logged out successfully!', type: 'success' })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification({ message: `A new blog "${blogObject.title}" by ${blogObject.author} added!`, type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
      blogFormRef.current.toggleVisibility()
    }
    catch (exception) {
      if (exception.response) {
        const { status, data } = exception.response
        setNotification({ message: `Error ${status}: ${data.error}`, type: 'error' })
      }
      else {
        setNotification({ message: 'An unexpected error occurred!', type: 'error' })
      }
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      setNotification({ message: `Blog "${returnedBlog.title}" updated successfully!`, type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
    catch (error) {
      setNotification({ message: `Error occurred while updating blog: ${error.message}`, type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setNotification({ message: 'Blog deleted successfully!', type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
    catch (exception) {
      setNotification({ message: 'Error occurred while deleting the blog!', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {user === null ?
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        /> :
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="New blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          {[...blogs]
            // sort blogs in descending order based on the number of likes
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
            )}
        </div>
      }
    </div>
  )
}

export default App