import { useState } from "react"

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState("")

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

  const allGenres = [...new Set(books.flatMap(book => book.genres))]

  const filteredBooks = selectedGenre
    ? books.filter(book => book.genres?.includes(selectedGenre))
    : books

  return (
    <div>
      <h2>books</h2>
      <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
				<option value="">All genres</option>
				{allGenres.map((genre) => (
					<option key={genre} value={genre}>
						{genre}
					</option>
				))}
			</select>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
