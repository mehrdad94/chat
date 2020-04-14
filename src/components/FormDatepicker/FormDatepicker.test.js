import React from 'react'
import enzyme from '../../lib/enzyme'
import FormDatepicker from './FormDatepicker'
import 'bootstrap'
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js'

describe('Form Datepicker', function () {
  let wrapper

  beforeEach(() => {
    wrapper = enzyme.mount(<FormDatepicker/>)
  })

  it('Should set initial picker value', function () {
    const pickerValue = 'value'

    wrapper.setProps({ pickerValue })

    wrapper.update()

    expect(wrapper.find('input').props().defaultValue).toBe(pickerValue)
  })

  it('should set picker label', function () {
    const pickerLabel = 'label'

    wrapper.setProps({ pickerLabel })

    expect(wrapper.find('label').text()).toBe(pickerLabel)
  })

  it('should set error box', function () {
    const invalidFeedback = 'invalidFeedback'

    wrapper.setProps({ invalidFeedback })

    expect(wrapper.find('input').hasClass('is-invalid')).toBeTruthy()
    expect(wrapper.find('.invalid-feedback').text()).toBe(invalidFeedback)
  })

  it('should call on change', function () {
    const changeValue = 'value'
    const onChange = jest.fn()

    wrapper.setProps({ onChange })

    wrapper.find('input').simulate('change', { target: { value: changeValue } })

    expect(onChange).toHaveBeenCalled()
  })
})
