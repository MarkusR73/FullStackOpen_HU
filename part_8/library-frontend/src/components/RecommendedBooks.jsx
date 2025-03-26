import { useQuery } from "@apollo/client"
import { GET_USER, ALL_BOOKS } from "../queries"

const RecommendedBooks = (props) => {
	const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
		skip: !props.show 
	})

	const favoriteGenre = userData?.me?.favoriteGenre

	const { data, loading, error } = useQuery(ALL_BOOKS, {
		variables: { genre: favoriteGenre },
		skip: !favoriteGenre, 
		fetchPolicy: "cache-and-network"
	})

	if (!props.show) return null

  if (userLoading || loading) return <p>Loading...</p>

	if (userError) return <p>Error fetching user info: {userError.message}</p>
	if (error) return <p>Error fetching books: {error.message}</p>

	const recommendedBooks = data?.allBooks || []

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
