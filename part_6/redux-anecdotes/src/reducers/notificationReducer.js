import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''  
    }
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const showNotification = (message, timeout) => {
  return (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout)
  }
}

export default notificationSlice.reducer
