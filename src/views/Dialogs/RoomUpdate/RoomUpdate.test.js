import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import reducers from '../../../redux/reducers'

import RoomUpdate from './RoomUpdate'

const initialState = {
  rooms: {
    roomsActive: {
      id: '12',
      publicId: '123',
      name: 'name',
      status: 'OFFLINE'
    }
  }
}

function renderWithRedux(
  ui,
  { initialState, store = createStore(reducers, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  }
}


test('Create new Room can render with redux with defaults', () => {
  const { getByText } = renderWithRedux(<RoomUpdate />)

  expect(getByText('Edit the Room')).toBeTruthy()
})

test('Render and change inputs', () => {
  const { getByLabelText } = renderWithRedux(<RoomUpdate />, { initialState })

  const inputName = getByLabelText('InputRoomName')
  const inputNameValue = initialState.rooms.roomsActive.name

  const inputPublicId = getByLabelText('InputRoomPublicId')
  const inputPublicIdValue = initialState.rooms.roomsActive.publicId

  expect(inputName.value).toBe(inputNameValue)
  expect(inputPublicId.value).toBe(inputPublicIdValue)
})