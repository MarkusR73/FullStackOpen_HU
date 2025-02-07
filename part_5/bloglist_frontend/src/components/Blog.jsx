import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }
  // Check if both blog.user and user are defined & compare username of the user who added the blog with the currently logged-in user's username
  const isUserBlogOwner = blog.user && user && blog.user.username === user.username

  return (
    <div style={blogStyle}>
      <div>
        {`${blog.title}, by ${blog.author}`}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
					Likes: {blog.likes} <button onClick={handleLike}>like</button>
          <p>{blog.user.name}</p>
          {isUserBlogOwner && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog