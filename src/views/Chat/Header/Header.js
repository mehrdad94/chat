import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { setToken, apiDisconnect } from '../../../api'
import { profileCurrentUserCreate } from '../../../redux/actions'
import { getProfileCurrentUser } from '../../../redux/reducers/profiles'
import $ from 'jquery'

const genState = props => {
  const {
    redirect = false
  } = props
  return {
    redirect
  }
}

class Header extends React.Component {
  state = genState(this.props)

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    } else return null
  }

  onLogoutClick = () => {
    setToken('')
    apiDisconnect()
    this.setRedirect()
    this.props.profileCurrentUserCreate('')
  }

  onChatSidebarToggleClick = () => {
    $('#chat-sidebar').toggleClass('open')
  }

  render () {
    return (
      <Fragment>
        { this.renderRedirect() }
        <div className="header navbar">
          <div className="header-container">
            <ul className="nav-left">
              <li className="d-n@md+">
                <a id="chat-sidebar-toggle" onClick={this.onChatSidebarToggleClick} className="td-n c-grey-900 cH-blue-500" href="#">
                  <i className="ti-menu"/>
                </a>
              </li>
            </ul>
            <ul className="nav-right">
              <li className="dropdown">
                <a href="" className="dropdown-toggle no-after peers fxw-nw ai-c lh-1" data-toggle="dropdown">
                  <div className="peer mR-10">
                    <img className="w-2r bdrs-50p"
                         width="32"
                         height="32"
                         src={this.props.profileCurrentUser.avatar}
                         alt="avatar"/>
                  </div>
                  <div className="peer">
                    <span className="fsz-sm c-grey-900 tt-c">{this.props.profileCurrentUser.name}</span>
                  </div>
                </a>
                <ul className="dropdown-menu fsz-sm">
                  {/*<li>*/}
                  {/*  <a href="" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">*/}
                  {/*    <i className="ti-settings mR-10"/>*/}
                  {/*    <span>Setting</span>*/}
                  {/*  </a>*/}
                  {/*</li>*/}
                  {/*<li role="separator" className="divider"/>*/}
                  <li>
                    <a onClick={this.onLogoutClick} className="cur-p d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                      <i className="ti-power-off mR-10"/>
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  profileCurrentUser: getProfileCurrentUser(state)
})

const mapActionsToProps = {
  profileCurrentUserCreate
}

export default connect(mapStateToProps, mapActionsToProps)(Header)
