import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '../Dialog/Dialog'

function ModalBody (props) {
    return (
      <div>
          <div className="fw-600 question p-15">
              {props.question}
          </div>
          <div className="text-right">
              <button className="btn cur-p m-5" data-dismiss="modal">No</button>
              <button className="btn btn-primary cur-p m-5" onClick={props.onAccept}>Yes</button>
          </div>
      </div>
    )
}

export class ConfirmModal extends React.Component {
    render() {
        const { question, onAccept } = this.props
        return (
            <Dialog {...this.props}
                    body={<ModalBody question={question} onAccept={onAccept}/>}/>
        )
    }
}

ConfirmModal.propTypes = {
    isActive: PropTypes.bool,
    question: PropTypes.string,
    onModalClose: PropTypes.func,
    onModalOpen: PropTypes.func,
    onAccept: PropTypes.func,
}

ConfirmModal.defaultProps = {
    isActive: false,
    question: '',
    onModalClose: () => {},
    onModalOpen: () => {},
    onAccept: () => {}
}