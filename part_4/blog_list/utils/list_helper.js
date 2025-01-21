/* eslint-disable no-unused-vars */
const dummy = (blogs) => {
  return 1
}
/* eslint-enable no-unused-vars */

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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorBlogCount = {}

  blogs.forEach((blog) => {
    if (authorBlogCount[blog.author]) {
      authorBlogCount[blog.author] += 1
    } else {
      authorBlogCount[blog.author] = 1
    }
  })

  let mostBlogsAuthor = {
    author: '',
    blogs: 0
  }

  for (const author in authorBlogCount) {
    if (authorBlogCount[author] > mostBlogsAuthor.blogs) {
      mostBlogsAuthor = { author, blogs: authorBlogCount[author] }
    }
  }

  return mostBlogsAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}