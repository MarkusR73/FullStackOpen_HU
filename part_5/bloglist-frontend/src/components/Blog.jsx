import { useState } from 'react'

const Blog = ({ blog }) => {
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
					Likes: {blog.likes} <button>like</button>
					<p>{blog.user?.name || 'Unknown'}</p>
				</div>
			)}
		</div>
	) 
}

export default Blog