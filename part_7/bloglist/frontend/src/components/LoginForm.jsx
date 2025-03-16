import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'
import { useUserDispatch } from '../contexts/UserContext'
import {
  useNotificationDispatch,
  useNotificationValue
} from '../contexts/NotificationContext'
import '../styles/LoginForm.css'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const userDispatch = useUserDispatch()
  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()

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
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'LOGIN', payload: user })
      notify('Login successful!', 'success')
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Login error:', exception)
      if (exception) {
        const { status, data } = exception.response
        notify(`Error ${status}: ${data.error}`, 'error')
      } else {
        notify('Wrong username or password!', 'error')
      }
    }
  }

  return (
    <div className="login-form">
      <Notification message={notification?.message} type={notification?.type} />
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
