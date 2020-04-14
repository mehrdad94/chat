// room name, avatar, room unique id
import React from 'react'
import { connect } from 'react-redux'
import { Dialog } from '../../../components/Dialog/Dialog'
import FormInput from '../../../components/FormInput/FormInput'
import { dialogActiveSet, roomUpdate } from '../../../redux/actions'
import constants from '../../../configs/constants'
import { apiRoomUpdate } from '../../../api'
import { getDialogActive } from '../../../redux/reducers/application'
import { getRooms } from '../../../redux/reducers/rooms'

const genState = props => {
  const {
    name = props.roomsActive.name || '',
    avatar = props.roomsActive.avatar || '',
    publicId = props.roomsActive.publicId || '',
    newPublicId = props.roomsActive.publicId || '',
    invalidFeedBacks = {
      name: '',
      avatar: '',
      newPublicId: ''
    }
  } = props
  return {
    name,
    avatar,
    publicId,
    newPublicId,
    invalidFeedBacks
  }
}

class RoomUpdate extends React.Component {
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
    } else if (error.name === 'RoomDuplicateError') {
      this.setState({
        invalidFeedBacks: {
          newPublicId: 'This room is taken please select something else'
        }
      })
    }
  }

  onAccept = () => {
    apiRoomUpdate({
      name: this.state.name,
      avatar: this.state.avatar,
      newPublicId: this.state.newPublicId,
      publicId: this.state.publicId,
      clb: payload => {
        if (payload.type === 'ERROR') this.onApiError(payload)
        else this.props.dialogActiveSet('')
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.roomsActive.id !== this.props.roomsActive.id) {
      // reset state
      this.setState(genState(this.props))
    }
  }

  DialogHeader = () => {
    return (
      <h5 className="m-0 dialog-title">Edit the Room</h5>
    )
  }

  DialogBody = () => {
    return (
      <form>
        <div className="form-group">
          <FormInput
            inputLabel={ 'Name' }
            inputValue={ this.state.name }
            inputAriaLabel={ 'InputRoomName' }
            invalidFeedback={ this.state.invalidFeedBacks.name }
            onChange={ event => this.handleChange('name', event) }/>
        </div>

        <div className="form-group">
          <FormInput
            inputLabel={ 'Choose a unique Id for your room' }
            inputValue={ this.state.newPublicId }
            inputAriaLabel={ 'InputRoomPublicId' }
            invalidFeedback={ this.state.invalidFeedBacks.newPublicId }
            onChange={ event => this.handleChange('newPublicId', event) }/>
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
    this.setState(genState(this.props))
  }

  render() {
    return (
      <Dialog
        onModalClose={this.onModalClose}
        isActive={this.props.dialogActive === constants.DIALOG_NAMES[1]}
        header={<this.DialogHeader/>}
        body={<this.DialogBody/>}
        footer={<this.DialogFooter/>}/>
    )
  }
}

const mapStateToProps = state => ({
  dialogActive: getDialogActive(state),
  roomsActive: getRooms(state)
})

const mapDispatchToProps = dispatch => {
  return {
    dialogActiveSet: () => dispatch(dialogActiveSet()),
    roomUpdate: (payload) => dispatch(roomUpdate(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomUpdate)
