import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SignUp from './SignUp'

describe('Test Login view', function () {
  it('should check input values', function () {
    const { getByLabelText } = render(<SignUp />)

    const inputSignUpName = getByLabelText('signUpFirstName')
    const inputSignUpNameValue = 'Name'

    const inputSignUpUsername = getByLabelText('signUpUsername')
    const inputSignUpUsernameValue = 'Name'

    const inputSignUpPassword = getByLabelText('signUpPassword')
    const inputSignUpPasswordValue = 'Value'

    const inputSignUpRePassword = getByLabelText('signUpRePassword')
    const inputSignUpRePasswordValue = 'Name'

    fireEvent.change(inputSignUpName, { target: { value: inputSignUpNameValue } })
    fireEvent.change(inputSignUpUsername, { target: { value: inputSignUpUsernameValue } })
    fireEvent.change(inputSignUpPassword, { target: { value: inputSignUpPasswordValue } })
    fireEvent.change(inputSignUpRePassword, { target: { value: inputSignUpRePasswordValue } })

    expect(inputSignUpName.value).toBe(inputSignUpNameValue)
    expect(inputSignUpUsername.value).toBe(inputSignUpUsernameValue)
    expect(inputSignUpPassword.value).toBe(inputSignUpPasswordValue)
    expect(inputSignUpRePassword.value).toBe(inputSignUpRePasswordValue)
  })
})