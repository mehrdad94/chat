import React from 'react'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'perfect-scrollbar'
import $ from 'jquery'

export class Dialog extends React.Component {
  constructor(props) {
    super(props)

    this.modalRef = React.createRef()
    this.scrollableRef = React.createRef()
  }

  showModal = () => {
    this.modalRef.current.modal('show')
  }

  hideModal = () => {
    this.modalRef.current.modal('hide')
  }

  onAccept = () => {
    this.hideModal()
    this.props.onAccept()
  }

  componentDidMount () {
    this.modalRef.current = $(this.modalRef.current)

    this.modalRef.current.on('hidden.bs.modal', e => { this.props.onModalClose(e) })

    this.modalRef.current.on('shown.bs.modal', e => { this.props.onModalOpen(e) })

    if (this.props.isActive) this.showModal()

    new PerfectScrollbar(this.scrollableRef.current)
  }

  componentDidUpdate (prevProps) {
    if (this.props.isActive !== prevProps.isActive) {
      this.props.isActive ? this.showModal() : this.hideModal()
    }
  }

  render() {
    return (
      <div className="modal fade" ref={this.modalRef} id={this.props.modalId}>
        <div className="modal-dialog confirm-dialog" role="document">
          <div className="modal-content">
            {this.modalId}
            {
              this.props.header ? (
                <div className="bd p-15">
                  { this.props.header }
                </div>
              ) : null
            }

            {
              this.props.body ? (
                <div className="modal-body" ref={this.scrollableRef}>
                  { this.props.body }
                </div>
              ) : null
            }

            {
              this.props.footer ? (
                <div className="text-right modal-footer">
                  { this.props.footer }
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    )
  }
}

Dialog.propTypes = {
  isActive: PropTypes.bool,
  onModalClose: PropTypes.func,
  onModalOpen: PropTypes.func,
  onAccept: PropTypes.func,
  header: PropTypes.object,
  body: PropTypes.object,
  footer: PropTypes.object,
  modalId: PropTypes.string
}

Dialog.defaultProps = {
  isActive: false,
  question: '',
  modalId: '',
  onModalClose: () => {},
  onModalOpen: () => {},
  onAccept: () => {}
}
