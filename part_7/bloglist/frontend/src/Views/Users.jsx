import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  const {
    data: users,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  if (isLoading) return <div>Loading users...</div>
  if (isError) return <div>Error loading users</div>

  const sortedUsers = [...users].sort((a, b) => b.blogs.length - a.blogs.length)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
