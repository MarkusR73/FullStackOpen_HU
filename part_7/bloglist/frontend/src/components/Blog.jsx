import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

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
  const isUserBlogOwner =
    blog.user && user && blog.user.username === user.username

  return (
    <div className="blog">
      <div className="blog-summary">
        <span className="blog-title">{blog.title}</span>, by{' '}
        <span className="blog-author">{blog.author}</span>
        <button className="toggle-visibility-btn" onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">
            Likes: {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p className="blog-user">{blog.user.name}</p>
          {isUserBlogOwner && (
            <button className="delete-btn" onClick={handleDelete}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
