import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

// Async thunk for fetching anecdotes
export const initializeAnecdotes = createAsyncThunk(
  'anecdotes/initializeAnecdotes',
  async () => {
    const anecdotes = await anecdoteService.getAll()
    return anecdotes
  }
)

// Async thunk for creating new anecdote
export const createAnecdote = createAsyncThunk(
  'anecdotes/createAnecdote',
  async (content) => {
    const newAnecdote = await anecdoteService.createNew(content)
    return newAnecdote
  }
)

// Async thunk for voting
export const voteAnecdote = createAsyncThunk(
  'anecdotes/voteAnecdote',
  async (id, { getState }) => {
    const { anecdotes } = getState()
    const anecdoteToVote = anecdotes.find(a => a.id === id)
    const updatedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    }
    const returnedAnecdote = await anecdoteService.update(id, updatedAnecdote)
    return returnedAnecdote
  }
)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeAnecdotes.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(voteAnecdote.fulfilled, (state, action) => {
        const id = action.payload.id
        const anecdoteToChange = state.find(n => n.id === id)
        if (anecdoteToChange) {
          anecdoteToChange.votes = action.payload.votes
        }
      })
  }
})

export default anecdoteSlice.reducer
