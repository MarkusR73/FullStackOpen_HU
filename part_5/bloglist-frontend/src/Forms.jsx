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

const BlogForm = ({ createBlog, title, setTitle, author, setAuthor, url, setUrl }) => (
	<div>
		<h1>blogs</h1>
		<form onSubmit={createBlog}>
			<div>
				titel:
					<input
					type="text"
					value={title}
					name="Title"
					onChange={({ target }) => setTitle(target.value)}
				/>
			</div>
			<div>
				author:
					<input
					type="text"
					value={author}
					name="Author"
					onChange={({ target }) => setAuthor(target.value)}
				/>
			</div>
			<div>
				url:
					<input
					type="text"
					value={url}
					name="Url"
					onChange={({ target }) => setUrl(target.value)}
				/>
			</div>
			<button type="submit">create</button>
		</form>
	</div>
)

export { LoginForm, BlogForm }