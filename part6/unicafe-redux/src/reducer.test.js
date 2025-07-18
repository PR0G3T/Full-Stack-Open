import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok is incremented', () => {
    const action = {
      type: 'OK'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('zero resets all counters', () => {
    const action = {
      type: 'ZERO'
    }
    const state = {
      good: 5,
      ok: 4,
      bad: 2
    }

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual(initialState)
  })

  test('multiple actions work correctly', () => {
    let state = initialState
    
    // Add some good feedback
    state = counterReducer(state, { type: 'GOOD' })
    state = counterReducer(state, { type: 'GOOD' })
    
    // Add some ok feedback
    state = counterReducer(state, { type: 'OK' })
    
    // Add some bad feedback
    state = counterReducer(state, { type: 'BAD' })
    state = counterReducer(state, { type: 'BAD' })
    state = counterReducer(state, { type: 'BAD' })

    expect(state).toEqual({
      good: 2,
      ok: 1,
      bad: 3
    })
  })

  test('reducer is immutable', () => {
    const state = {
      good: 5,
      ok: 4,
      bad: 2
    }
    const action = {
      type: 'GOOD'
    }

    deepFreeze(state)
    const newState = counterReducer(state, action)
    
    // Original state should be unchanged
    expect(state).toEqual({
      good: 5,
      ok: 4,
      bad: 2
    })
    
    // New state should have incremented good
    expect(newState).toEqual({
      good: 6,
      ok: 4,
      bad: 2
    })
    
    // States should be different objects
    expect(newState).not.toBe(state)
  })
})
