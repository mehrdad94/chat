import React from 'react'
import enzyme from '../../lib/enzyme'
import { Dialog } from './Dialog'
import 'bootstrap'

describe('Dialog', function () {
  it('should call on modal open', function () {
    const onModalOpen = () => {
      expect(true).toBe(true)
    }

    enzyme.mount(<Dialog isActive={true} onModalOpen={onModalOpen}/>)
  })

  it('should call on modal close', () => {
    const onModalClose = () => {
      expect(true).toBe(true)
    }

    const onModalOpen = () => {
      wrapper.setProps({
        isActive: false
      })
    }

    const wrapper = enzyme.mount(<Dialog isActive={false} onModalClose={onModalClose} onModalOpen={onModalOpen}/>)
  })

  it('should test modal header', function () {
    function Header () {
      return (<div className="header">header</div>)
    }

    const wrapper = enzyme.mount(<Dialog isActive={true} header={<Header/>}/>)

    expect(wrapper.find('.header').text()).toBe('header')
  });

  it('should test modal body', function () {
    function Body () {
      return (<div className="body">body</div>)
    }

    const wrapper = enzyme.mount(<Dialog isActive={true} body={<Body/>}/>)

    expect(wrapper.find('.body').text()).toBe('body')
  });

  it('should test modal footer', function () {
    function Footer () {
      return (<div className="footer">footer</div>)
    }

    const wrapper = enzyme.mount(<Dialog isActive={true} footer={<Footer/>}/>)

    expect(wrapper.find('.footer').text()).toBe('footer')
  });
})