import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'Teppo testaa blog summarya',
    author: 'Teppo Testaaja',
    url: 'www.tepi-testaa.fi',
    likes: 0,
    user: { name: 'Matti Näsä' }
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('Renders only blog`s summary elements', () => {
    // Check that title, author and view button are visible
    expect(container.querySelector('.blog-title')?.textContent).toBe('Teppo testaa blog summarya')
    expect(container.querySelector('.blog-author')?.textContent).toBe('Teppo Testaaja')
    expect(container.querySelector('.toggle-visibility-btn')?.textContent).toBe('view')

    // Ensure that URL, likes and user are not visible
    expect(container.querySelector('.blog-url')).toBeNull()
    expect(container.querySelector('.blog-likes')).toBeNull()
    expect(container.querySelector('.blog-user')).toBeNull()
  })

  test('Renders all details when view button is clicked', async () => {

    const user = userEvent.setup()
    const viewButton = container.querySelector('.toggle-visibility-btn')

    await user.click(viewButton)

    expect(container.querySelector('.blog-title')?.textContent).toBe('Teppo testaa blog summarya')
    expect(container.querySelector('.blog-author')?.textContent).toBe('Teppo Testaaja')
    expect(container.querySelector('.blog-url')?.textContent).toBe('www.tepi-testaa.fi')
    // Avoids issues with the like-button text
    expect(container.querySelector('.blog-likes')?.textContent).toContain('Likes: 0')
    expect(container.querySelector('.blog-user')?.textContent).toBe('Matti Näsä')
    expect(container.querySelector('.toggle-visibility-btn')?.textContent).toBe('hide')
  })
})