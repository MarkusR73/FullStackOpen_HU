const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword
}) => (
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

export default LoginForm
