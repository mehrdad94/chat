import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Sidebar from './Sidebar'
import { createStore} from 'redux'
import reducers from '../../../redux/reducers'
import { Provider } from 'react-redux'

function renderWithRedux(
  ui,
  { initialState, store = createStore(reducers, initialState) } = {}
) {

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  }
}

test('it should search through sidebar data', function () {
  const { getByPlaceholderText, queryByText } = renderWithRedux(<Sidebar/>)

  const searchElement = getByPlaceholderText('Search rooms...')

  const elementBeforeSearch = queryByText('adam doe')

  expect(elementBeforeSearch).toBeInTheDocument()

  fireEvent.change(searchElement, { target: { value: 'invalid' } })

  const elementAfterSearch = queryByText('Adam Doe')

  expect(elementAfterSearch).not.toBeInTheDocument()
})

test('it should fire new item', function () {
  const { getByTestId } = renderWithRedux(<Sidebar/>)

  const addElement = getByTestId('btn-new-item')

  expect(addElement).toBeInTheDocument()
})
