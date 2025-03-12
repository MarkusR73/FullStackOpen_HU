import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  return (
    <NotificationContext.Provider
      value={{
        notification,
        notificationDispatch
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  return useContext(NotificationContext).notification
}

export const useNotificationDispatch = () => {
  return useContext(NotificationContext).notificationDispatch
}
