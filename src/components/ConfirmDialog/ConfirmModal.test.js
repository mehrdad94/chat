import React from 'react'
import { ConfirmModal } from './ConfirmModal'
import enzyme from '../../lib/enzyme'
import 'bootstrap'

describe('should test confirm modal', function () {
    it('should check props', () => {
        const question = 'question'

        const wrapper = enzyme.mount(<ConfirmModal isActive={false} question={question}/>)

        expect(wrapper.find('.question').text()).toBe(question)
    })

    it('should call on accept', function () {
        const onAccept = () => {
            expect(true).toBe(true)
        }

        const wrapper = enzyme.mount(<ConfirmModal onAccept={onAccept}/>)

        wrapper.find('.confirm-dialog .btn-primary').simulate('click')
    })
})
