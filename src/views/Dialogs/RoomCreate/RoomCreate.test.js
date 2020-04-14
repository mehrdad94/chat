import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import application  from '../../../redux/reducers/application'

import CreateNewRoom from './RoomCreate'

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
  const { getByText } = renderWithRedux(<CreateNewRoom />)

  expect(getByText('Create A Room')).toBeTruthy()
})

test('Render and change inputs', () => {
  const { getByLabelText } = renderWithRedux(<CreateNewRoom />)

  const inputName = getByLabelText('InputRoomName')
  const inputNameValue = 'Name'

  const inputPublicId = getByLabelText('InputRoomPublicId')
  const inputPublicIdValue = 'Value'

  fireEvent.change(inputName, { target: { value: inputNameValue } })
  fireEvent.change(inputPublicId, { target: { value: inputPublicIdValue } })

  expect(inputName.value).toBe(inputNameValue)
  expect(inputPublicId.value).toBe(inputPublicIdValue)
})