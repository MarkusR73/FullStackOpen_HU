import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import {
  useNotificationValue,
  useNotificationDispatch
} from './contexts/NotificationContext'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type) => {
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, type }
    })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify('Login successful!', 'success')
    } catch (exception) {
      notify('Wrong username or password!', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    notify('Logged out successfully!', 'success')
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      notify(
        `A new blog "${blogObject.title}" by ${blogObject.author} added!`,
        'success'
      )
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      if (exception.response) {
        const { status, data } = exception.response
        notify(`Error ${status}: ${data.error}`, 'error')
      } else {
        notify('An unexpected error occurred!', 'error')
      }
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      notify(`Blog "${returnedBlog.title}" updated successfully!`, 'success')
    } catch (error) {
      notify(`Error occurred while updating blog: ${error.message}`, 'error')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      notify('Blog deleted successfully!', 'success')
    } catch (exception) {
      notify('Error occurred while deleting the blog!', 'error')
    }
  }

  return (
    <div>
      <Notification message={notification?.message} type={notification?.type} />
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
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
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
