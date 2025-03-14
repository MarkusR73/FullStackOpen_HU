import { createContext, useReducer, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(action.payload)
      )
      return action.payload
    case 'LOGOUT':
      window.localStorage.removeItem('loggedBlogappUser')
      return null
    case 'SET_USER':
      return action.payload
    default:
      return state
  }
}

const UserContext = createContext()

export const UserProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  return useContext(UserContext).user
}

export const useUserDispatch = () => {
  return useContext(UserContext).userDispatch
}
