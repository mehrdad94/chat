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

  render () {
    return (
      <Fragment>
        { this.renderRedirect() }

        <div className="header navbar">
          <div className="header-container">
            <ul className="nav-left ml-0">
              <li className="dropdown">
                <a href="" className="dropdown-toggle no-after peers fxw-nw ai-c lh-1 pL-10" data-toggle="dropdown">
                  <div className="peer mR-10">
                    <img className="bdrs-50p"
                         width="48"
                         height="48"
                         src={this.props.profileCurrentUser.avatar}
                         alt="avatar"/>
                  </div>
                  <div className="peer">
                    <span className="fsz-sm c-grey-900 tt-c">{this.props.profileCurrentUser.name}</span>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-left fsz-sm">
                  {/*<li>*/}
                  {/*  <a href="" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">*/}
                  {/*    <i className="ti-settings mR-10"/>*/}
                  {/*    <span>Setting</span>*/}
                  {/*  </a>*/}
                  {/*</li>*/}
                  {/*<li role="separator" className="divider"/>*/}
                  <li>
                    <a onClick={this.onLogoutClick} className="cur-p d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                      <i className="ti-power-off mX-10"/>
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
