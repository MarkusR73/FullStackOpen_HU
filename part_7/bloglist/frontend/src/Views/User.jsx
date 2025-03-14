import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import blogService from '../services/blogs'

const UserView = () => {
  const { id } = useParams()

  const {
    data: user,
    isLoading: userLoading,
    isError: userError
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id)
  })

  if (userLoading) return <div>Loading user`s blogs...</div>
  if (userError) return <div>Error loading data</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
