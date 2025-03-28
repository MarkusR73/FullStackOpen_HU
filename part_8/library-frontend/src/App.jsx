import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Notify from './components/Notify'
import RecommendedBooks from "./components/RecommendedBooks"
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries"

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [allGenres, setAllGenres] = useState([])
  const client = useApolloClient()

  const { data: authorData, loading: authorLoading, error: authorError } = useQuery(ALL_AUTHORS)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setPage("authors")
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} added!`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      setAllGenres(prevGenres => {
        const updatedGenres = new Set([...prevGenres, ...addedBook.genres])
        return Array.from(updatedGenres)
      })
    }
  })


  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommend")}>recommend</button>}
        {token && <button onClick={() => logout()}>logout</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>} 
      </div>

      <Authors show={page === "authors"} data={authorData} loading={authorLoading} error={authorError} token={token} />

      <Books show={page === "books"} allGenres={allGenres} setAllGenres={setAllGenres}/>

      <NewBook show={page === "add"} setError={notify} />

      <LoginForm show={page === "login"} setToken={setToken} setError={notify} setPage={setPage} />

      <RecommendedBooks show={page === "recommend"} setError={notify} />
    </div>
  )
}

export default App
