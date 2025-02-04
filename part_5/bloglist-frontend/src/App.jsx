import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import { LoginForm, BlogForm } from './Forms'

const App = () => {
  const [blogs, setBlogs] = useState([])
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
      const user = await loginService.login({
        username, password,
      })
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
					<BlogForm />
					{blogs.map(blog =>
        		<Blog key={blog.id} blog={blog} />
      		)}
      	</div>
    	}
    </div>
  )
}

export default App