const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => {
		return sum + blog.likes
	}

return blogs.length === 0
	? 0
	: blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, blog) => {
    return blog.likes > max.likes ? blog : max
  }

	if (blogs.length === 0) return null

	const favorite = blogs.reduce(reducer, blogs[0])

  return {
	  title: favorite.title,
	  author: favorite.author,
	  likes: favorite.likes,
	}
}

module.exports = {
  dummy,
	totalLikes,
	favoriteBlog
}