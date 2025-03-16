import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BlogView = ({ notify }) => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const {
    data: blog,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id)
  })

  const likeMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries(['blog', id])
      notify(`Blog "${updatedBlog.title}" updated successfully!`, 'success')
    },
    onError: (error) => {
      notify(`Error occurred while updating blog: ${error.message}`, 'error')
    }
  })

  if (isLoading) return <div>Loading blog...</div>
  if (isError || !blog) return <div>Error loading blog</div>

  const handleLike = () => {
    likeMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  return (
    <div>
      <h2>
        {blog.title} - {blog.author}
      </h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        Likes: {blog.likes} <button onClick={handleLike}>Like</button>
      </p>
      <p>Added by {blog.user?.name || 'Unknown'}</p>
      <h3>Comments</h3>
      <ul>
        {blog.comments && blog.comments.length > 0 ? (
          blog.comments.map((comment, index) => <li key={index}>{comment}</li>)
        ) : (
          <p>No comments yet.</p>
        )}
      </ul>
    </div>
  )
}

export default BlogView
