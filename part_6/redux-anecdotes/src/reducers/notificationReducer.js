import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setMessage(state, action) {
      return action.payload
    },
    clearMessage() {
      return null  
    }
  }
})

export const { setMessage, clearMessage } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(setMessage(message))
    setTimeout(() => {
      dispatch(clearMessage())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
