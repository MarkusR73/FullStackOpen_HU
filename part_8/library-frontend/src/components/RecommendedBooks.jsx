import { useQuery } from "@apollo/client"
import { GET_USER } from "../queries"

const RecommendedBooks = (props) => {
	const { loading, error, data } = useQuery(GET_USER)

	if (!props.show) {
    return null
  }
  if (props.loading) {
		return <p>Loading books...</p>
	}

	if (props.error) {
		return <p>Error fetching books: {props.error.message}</p>
	}

	if (loading) return <p>Loading user info...</p>
	if (error) return <p>Error fetching user info: {error.message}</p>

	const favoriteGenre = data?.me?.favoriteGenre

	const recommendedBooks = props.books?.allBooks?.filter(book => book.genres.includes(favoriteGenre))

	return (
		<div>
			<h2>Recommendations</h2>
			<p>Books in your favorite genre <strong>{favoriteGenre}</strong></p>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>Author</th>
						<th>Published</th>
					</tr>
					{recommendedBooks.map(book => (
						<tr key={book.title}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default RecommendedBooks
