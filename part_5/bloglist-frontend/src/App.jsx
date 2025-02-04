import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import { LoginForm, BlogForm } from './Forms'

const App = () => {
  const [blogs, setBlogs] = useState([])
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')
	const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
	const [user, setUser] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)
	const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

	const createBlog = async (event) => {
    event.preventDefault()
    
    try {
      const newBlog = await blogService.create({ title, author, url })
			setBlogs(blogs.concat(newBlog))
			setNotification({ message: `A new blog ${title} by ${author} added!`, type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
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
					<p>
						{user.name} logged in
						<button onClick={handleLogout}>logout</button>
					</p>
					<BlogForm 
						createBlog={createBlog}
						title={title}
						setTitle={setTitle}
						author={author}
						setAuthor={setAuthor}
						url={url}
						setUrl={setUrl}
					/>
					{blogs.map(blog =>
        		<Blog key={blog.id} blog={blog} />
      		)}
      	</div>
    	}
    </div>
  )
}

export default App