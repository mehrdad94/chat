import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Login from './Login'

describe('Test Login view', function () {
  it('should check input values', function () {
    const { getByLabelText } = render(<Login />)

    const inputLoginUsername = getByLabelText('loginUsername')
    const inputLoginUsernameValue = 'Name'

    const inputLoginPassword = getByLabelText('loginPassword')
    const inputLoginPasswordValue = 'Value'

    fireEvent.change(inputLoginUsername, { target: { value: inputLoginUsernameValue } })
    fireEvent.change(inputLoginPassword, { target: { value: inputLoginPasswordValue } })

    expect(inputLoginUsername.value).toBe(inputLoginUsernameValue)
    expect(inputLoginPassword.value).toBe(inputLoginPasswordValue)
  })
})