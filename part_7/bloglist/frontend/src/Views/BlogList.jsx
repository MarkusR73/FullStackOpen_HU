import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import '../styles/BlogList.css'

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
    <div className="blog-list">
      {blogs.map((blog) => (
        <div className="blog-item" key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} - {blog.author}
          </Link>
          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default BlogList
