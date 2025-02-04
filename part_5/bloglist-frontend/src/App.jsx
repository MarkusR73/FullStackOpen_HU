import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import { LoginForm, BlogForm } from './Forms'

const App = () => {
  const [blogs, setBlogs] = useState([])
	const [title, setTitle] = useState([])
	const [author, setAuthor] = useState([])
	const [url, setUrl] = useState([])
	const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
	const [user, setUser] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)

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
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedNoteappUser')
		setUser(null)
	}

	const createBlog = async (event) => {
    event.preventDefault()
    
    try {
      const newBlog = await blogService.create({ title, author, url })
			setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } 
		catch (exception) {
			if (exception.response) {
				const { status, data } = exception.response
				setErrorMessage(`Error ${status}: ${data.error}`)
			} else {
				setErrorMessage('An unexpected error occurred')
			}
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
    }
	}

  return (
    <div>
			<Notification message={errorMessage} />
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