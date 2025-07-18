import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotificationWithTimeout = (message, timeInSeconds = 5) => {
  return dispatch => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    dispatch(setNotification(message))
    
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, timeInSeconds * 1000)
  }
}

export default notificationSlice.reducer
