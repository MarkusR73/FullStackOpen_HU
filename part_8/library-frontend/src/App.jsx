import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")

  const { data: bookData, loading: bookLoading, error: bookError } = useQuery(ALL_BOOKS)
  const { data: authorData, loading: authorLoading, error: authorError } = useQuery(ALL_AUTHORS)


  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} data={authorData} loading={authorLoading} error={authorError} />

      <Books show={page === "books"}  data={bookData} loading={bookLoading} error={bookError} />

      <NewBook show={page === "add"} />
    </div>
  )
}

export default App
