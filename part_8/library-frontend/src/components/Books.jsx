import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState("")

  // Fetch all books when entering the books view (without filtering)
  const { data: allBooksData, loading: allBooksLoading, error: allBooksError, refetch: refetchAllBooks } = useQuery(ALL_BOOKS, {
    fetchPolicy: "cache-and-network",
    skip: !props.show 
  })

  // Fetch books based on selected genre
  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    fetchPolicy: "cache-and-network",
  })

  // Set allGenres only when entering the books view
  useEffect(() => {
    if (allBooksData) {
      const genres = [...new Set(allBooksData.allBooks.flatMap(book => book.genres))]
      props.setAllGenres(prevGenres => {
        const newGenres = new Set([...prevGenres, ...genres])
        return Array.from(newGenres)
      })
    }
  }, [allBooksData])

  // Refetch books when genre changes and when entering the view
  useEffect(() => {
		refetch({ genre: selectedGenre })
	}, [selectedGenre, props.show, refetch])

  if (!props.show) return null

  if (loading || allBooksLoading) return <p>Loading books...</p>

  if (error || allBooksError) return <p>Error fetching books: {error?.message || allBooksError?.message}</p>

  const books = data?.allBooks || []

  return (
    <div>
      <h2>books</h2>
      <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
				<option value="">All genres</option>
				{props.allGenres.map((genre) => (
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
          {books.map((a) => (
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
