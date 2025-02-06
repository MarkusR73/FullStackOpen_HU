const listWithOneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
]

const listWithMultipleBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const listWithMultipleUserBlogs = [
  {
    url: 'https://reactpatterns.com/',
    title: 'React patterns',
    author: 'Michael Chan',
    user: '6421e899e4b0d1cfa9e8be47', // example user ObjectId
    likes: 7
  },
  {
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    user: '6421e899e4b0d1cfa9e8be47',
    likes: 5
  },
  {
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    user: '6421e899e4b0d1cfa9e8be47',
    likes: 12
  },
  {
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    title: 'First class tests',
    author: 'Robert C. Martin',
    user: '6421e899e4b0d1cfa9e8be47',
    likes: 10
  },
  {
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    user: '6421e899e4b0d1cfa9e8be47',
    likes: 0
  },
  {
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    title: 'Type wars',
    author: 'Robert C. Martin',
    user: '6421e899e4b0d1cfa9e8be47',
    likes: 2
  }
]

module.exports = {
  listWithOneBlog,
  listWithMultipleBlogs,
  listWithMultipleUserBlogs
}
