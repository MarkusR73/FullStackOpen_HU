import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './Views/Users'
import UserView from './Views/User'
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

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`Blog "${updatedBlog.title}" updated successfully!`, 'success')
    },
    onError: (error) => {
      notify(`Error occurred while updating blog: ${error.message}`, 'error')
    }
  })

  const updateBlog = (id, blog) => {
    updateBlogMutation.mutate({
      id: id,
      updatedBlog: { ...blog }
    })
  }

  const deleteBlogMutation = useMutation({
    mutationFn: ({ id }) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      notify('Blog deleted successfully!', 'success')
    },
    onError: (error) => {
      notify('Error occurred while deleting the blog!', 'error')
    }
  })

  const deleteBlog = async (id) => {
    deleteBlogMutation.mutate({ id: id })
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
        <Notification
          message={notification?.message}
          type={notification?.type}
        />
        {user === null ? (
          <LoginForm />
        ) : (
          <div>
            <h1>Blogs</h1>
            <p>
              {user.name} logged in
              <button onClick={handleLogout}>logout</button>
            </p>
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
                }
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
