import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Notify from './components/Notify'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const { data: bookData, loading: bookLoading, error: bookError } = useQuery(ALL_BOOKS)
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


  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => logout()}>logout</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>} 
      </div>

      <Authors show={page === "authors"} data={authorData} loading={authorLoading} error={authorError} token={token} />

      <Books show={page === "books"}  data={bookData} loading={bookLoading} error={bookError} />

      <NewBook show={page === "add"} setError={notify} />

      <LoginForm show={page === "login"} setToken={setToken} setError={notify} setPage={setPage} />
    </div>
  )
}

export default App
