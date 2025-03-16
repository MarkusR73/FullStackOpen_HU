import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import NavBar from './components/NavBar'
import Users from './views/Users'
import UserView from './views/User'
import BlogList from './views/BlogList'
import BlogView from './views/BlogView'
import {
  useNotificationValue,
  useNotificationDispatch
} from './contexts/NotificationContext'
import { useUserValue, useUserDispatch } from './contexts/UserContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const blogFormRef = useRef()

  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()

  const user = useUserValue()
  const userDispatch = useUserDispatch()

  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  const notify = (message, type) => {
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, type }
    })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 3000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'LOGOUT' })
    notify('Logged out successfully!', 'success')
  }

  const createBlogMutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog),
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries(['blogs'])
      notify(
        `A new blog "${newBlog.title}" by ${newBlog.author} added!`,
        'success'
      )
      blogFormRef.current.toggleVisibility()
    },
    onError: (error) => {
      console.error('Blog creation error:', error.response || error)
      if (error.response) {
        const { status, data } = error.response
        notify(`Error ${status}: ${data.error}`, 'error')
      } else {
        notify('An unexpected error occurred!', 'error')
      }
    }
  })

  const createBlog = (newBlog) => {
    createBlogMutation.mutate(newBlog)
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1
  })

  if (result.isLoading) return <div>Loading...</div>
  if (result.isError) return <div>Error loading blogs</div>

  const blogs = result.data

  return (
    <Router>
      <div>
        {user === null ? (
          <LoginForm />
        ) : (
          <div>
            <NavBar user={user} handleLogout={handleLogout} />
            <Notification
              message={notification?.message}
              type={notification?.type}
            />
            <h1>Blog app</h1>
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserView />} />
              <Route
                path="/"
                element={
                  <div>
                    <Togglable buttonLabel="New blog" ref={blogFormRef}>
                      <BlogForm createBlog={createBlog} />
                    </Togglable>
                    <BlogList blogs={blogs} notify={notify} />
                  </div>
                }
              />
              <Route path="/blogs/:id" element={<BlogView notify={notify} />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
