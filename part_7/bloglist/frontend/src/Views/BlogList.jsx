import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BlogList = ({ blogs, notify }) => {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      notify('Blog deleted successfully!', 'success')
    },
    onError: (error) => {
      if (error.response?.status === 403) {
        notify('You are not authorized to delete this blog!', 'error')
      } else {
        notify('Error occurred while deleting the blog!', 'error')
      }
    }
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id} style={{ marginBottom: '10px' }}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} - {blog.author}
          </Link>
          <button
            onClick={() => handleDelete(blog.id)}
            style={{ marginLeft: '10px' }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default BlogList
