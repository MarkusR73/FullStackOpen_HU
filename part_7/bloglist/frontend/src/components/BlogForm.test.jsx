import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('The form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    // Select the input elements using the 'name' attribute
    const titleInput = container.querySelector('input[name="Title"]')
    const authorInput = container.querySelector('input[name="Author"]')
    const urlInput = container.querySelector('input[name="Url"]')

    // Find the submit button using 'type' attribute
    const submitButton = container.querySelector('button[type="submit"]')

    await user.type(titleInput, 'Teppo testaa blog formia')
    await user.type(authorInput, 'Teppo Testaaja')
    await user.type(urlInput, 'www.tepi-testaa.fi')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Teppo testaa blog formia',
      author: 'Teppo Testaaja',
      url: 'www.tepi-testaa.fi'
    })
  })
})
