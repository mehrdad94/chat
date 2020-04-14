import React from 'react'
import { Unavailable }from './Unavailable'
import enzyme from '../../lib/enzyme'

describe("Unavailable component", function () {
  let wrapper
  const props = {
    isActive: true,
    title: 'title',
    description: 'description'
  }

  beforeEach(() => {
    wrapper = enzyme.mount(<Unavailable {...props} />)
  })

  it('should render with props', function () {
    const description = wrapper.find('.description')
    const title = wrapper.find('.title')

    expect(description.text()).toBe(props.description)
    expect(title.text()).toBe(props.title)
  });
})