const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => (
	<div>
		<h1>log in to application</h1>
		<form onSubmit={handleLogin}>
		<div>
			username
				<input
				type="text"
				value={username}
				name="Username"
				onChange={({ target }) => setUsername(target.value)}
				/>
		</div>
		<div>
			password
				<input
				type="password"
				value={password}
				name="Password"
				onChange={({ target }) => setPassword(target.value)}
				/>
		</div>
		<button type="submit">login</button>
		</form>      
	</div>
)

const BlogForm = () => (
	<div>
		<h1>blogs</h1>
		<form ></form>
	</div>
)

export { LoginForm, BlogForm }