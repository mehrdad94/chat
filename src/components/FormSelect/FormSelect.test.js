import React from 'react'
import enzyme from '../../lib/enzyme'
import FormSelect from './FormSelect'

describe('Test form select', function () {
  let wrapper

  beforeEach(() => {
    wrapper = enzyme.mount(<FormSelect/>)
  })

  it('Should set initial select value', function () {
    const selectValue = 'value'

    wrapper.setProps({ selectValue })

    wrapper.update()

    expect(wrapper.find('select').props().defaultValue).toBe(selectValue)
  })

  it('should set select label', function () {
    const selectLabel = 'label'

    wrapper.setProps({ selectLabel })

    expect(wrapper.find('label').text()).toBe(selectLabel)
  })

  it('should set error box', function () {
    const invalidFeedback = 'invalidFeedback'

    wrapper.setProps({ invalidFeedback })

    expect(wrapper.find('select').hasClass('is-invalid')).toBeTruthy()
    expect(wrapper.find('.invalid-feedback').text()).toBe(invalidFeedback)
  })

  it('should call on change', function () {
    const changeValue = 'value'
    const onChange = jest.fn()

    wrapper.setProps({ onChange })

    wrapper.find('select').simulate('change', { target: { value: changeValue } })

    expect(onChange).toHaveBeenCalled()
  })

  it('should set select options', function () {
    const selectOptions = [{
      label: 'label',
      value: 'value',
      id: 'id'
    }, {
      label: 'label1',
      value: 'value1',
      id: 'id1'
    }]

    wrapper.setProps({ selectOptions })

    const options = wrapper.find('option')

    expect(options.length).toBe(selectOptions.length + 1)
  })
})
