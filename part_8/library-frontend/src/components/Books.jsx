const Books = (props) => {
  if (!props.show) {
    return null
  }
  if (props.loading) {
		return <p>Loading books...</p>
	}

	if (props.error) {
		return <p>Error fetching books: {props.error.message}</p>
	}

  const books = props.data?.allBooks || []

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
