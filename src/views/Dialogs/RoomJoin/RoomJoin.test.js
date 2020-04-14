import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import application  from '../../../redux/reducers/application'

import RoomJoin from './RoomJoin'

function renderWithRedux(
  ui,
  { initialState, store = createStore(combineReducers({ application }), initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  }
}


test('Create new Room can render with redux with defaults', () => {
  const { getByText } = renderWithRedux(<RoomJoin />)

  expect(getByText('Join A Room')).toBeTruthy()
})

test('Render and change inputs', () => {
  const { getByLabelText } = renderWithRedux(<RoomJoin />)

  const inputPublicId = getByLabelText('InputRoomPublicId')
  const inputPublicIdValue = 'Value'

  fireEvent.change(inputPublicId, { target: { value: inputPublicIdValue } })

  expect(inputPublicId.value).toBe(inputPublicIdValue)
})