import React from 'react'
import { render } from '@testing-library/react'
import ChatBoxToolBar from './ChatBoxToolBar'
import { createStore} from 'redux'
import reducers from '../../../redux/reducers'
import { Provider } from 'react-redux'

const initialState = {
  rooms: {
    roomsActive: {
      id: '12',
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

test('It should render ChatBoxToolBar with active item', function () {
  const { queryByText } = renderWithRedux(<ChatBoxToolBar/>, { initialState })

  const nameElm = queryByText(initialState.rooms.roomsActive.name)
  const statusElm = queryByText('Offline')

  expect(nameElm).toBeTruthy()
  expect(statusElm).toBeTruthy()
})