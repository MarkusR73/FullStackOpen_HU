import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('Renders only blog`s summary elements', () => {
  const blog = {
    title: 'Teppo testaa blog summarya',
    author: 'Teppo Testaaja',
    url: 'www.tepi-testaa.fi',
    likes: 0,
    user: { name: 'Matti Näsä' }
  }

  const { container } = render(<Blog blog={blog} />)

  // Check that title, author and view button are visible
  expect(container.querySelector('.blog-title')?.textContent).toBe('Teppo testaa blog summarya')
  expect(container.querySelector('.blog-author')?.textContent).toBe('Teppo Testaaja')
  expect(container.querySelector('.toggle-visibility-btn')?.textContent).toBe('view')

  // Ensure that URL, likes and user are not visible
  expect(container.querySelector('.blog-url')).toBeNull()
  expect(container.querySelector('.blog-likes')).toBeNull()
  expect(container.querySelector('.blog-user')).toBeNull()
})