// room name, avatar, room unique id
import React from 'react'
import { connect } from 'react-redux'
import { Dialog } from '../../../components/Dialog/Dialog'
import FormInput from '../../../components/FormInput/FormInput'
import { dialogActiveSet } from '../../../redux/actions'
import constants from '../../../configs/constants'
import { apiRoomJoin } from '../../../api'
import { getDialogActive } from '../../../redux/reducers/application'

const genState = props => {
  const {
    publicId = '',
    invalidFeedBacks = {
      name: '',
      avatar: '',
      publicId: '',
    }
  } = props
  return {
    publicId,
    invalidFeedBacks
  }
}

class RoomJoin extends React.Component {
  state = genState(this.props)

  handleChange = (type, event) => {
    this.setState({
      [type]: event.target.value
    })
  }
  onApiError = error => {
    if (error.name === 'ValidationError') {
      this.setState({
        invalidFeedBacks: error.errors
      })
    } else if (error.name === 'RoomNotExistError') {
      this.setState({
        invalidFeedBacks: {
          publicId: 'This room does not exist or you are already in that room.'
        }
      })
    }
  }
  onAccept = () => {
    apiRoomJoin({
      publicId: this.state.publicId,
      clb: payload => {
        if (payload.type === 'ERROR') this.onApiError(payload)
        else this.props.dialogActiveSet('')
      }
    })
  }

  DialogHeader = () => {
    return (
      <h5 className="m-0 dialog-title">Join A Room</h5>
    )
  }

  DialogBody = () => {
    return (
      <form>
        <div className="form-group">
          <FormInput
            inputLabel={ 'Room ID' }
            inputValue={ this.state.publicId }
            inputAriaLabel={ 'InputRoomPublicId' }
            invalidFeedback={ this.state.invalidFeedBacks.publicId }
            onChange={ event => this.handleChange('publicId', event) }/>
        </div>
      </form>
    )
  }

  DialogFooter = () => {
    return (
      <div className="w-100">
        <button type="button" className="btn mr-1" data-dismiss="modal">Close</button>
        <button className="btn btn-primary cur-p ml-1" onClick={this.onAccept}>Done</button>
      </div>
    )
  }

  onModalClose = () => {
    this.props.dialogActiveSet('')

    // reset state
    this.setState(genState(this.props))
  }

  render() {
    return (
      <Dialog
        onModalClose={this.onModalClose}
        isActive={this.props.dialogActive === constants.DIALOG_NAMES[3]}
        header={<this.DialogHeader/>}
        body={<this.DialogBody/>}
        footer={<this.DialogFooter/>}/>
    )
  }
}

const mapStateToProps = state => ({
  dialogActive: getDialogActive(state)
})

const mapDispatchToProps = dispatch => {
  return {
    dialogActiveSet: dialogName => dispatch(dialogActiveSet(dialogName)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomJoin)
