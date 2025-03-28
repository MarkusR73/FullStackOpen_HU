import { gql } from '@apollo/client'

const BOOK_INFO = gql`
  fragment BookInfo on Book {
    title
    author {
      name
    }
    published
    genres
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String){
    allBooks(genre: $genre) {
      ...BookInfo
    }
  }
  ${BOOK_INFO}
`
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
    name
    born
    bookCount
    }
  }`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      ...BookInfo
    }
  }
  ${BOOK_INFO}
`

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $born: Int!) {
    editAuthor(
      name: $name
      setBornTo: $born
    ) {
      name
      born  
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookInfo
    }
  }
  ${BOOK_INFO}
`

