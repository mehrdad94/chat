import React, { Fragment } from 'react'
import {
  Link,
  Redirect
} from 'react-router-dom'
import FormInput from '../../components/FormInput/FormInput'
import { signUp, setToken } from '../../api'
import backgroundImg from '../../static/images/bg.jpg'
import logoImg from '../../static/images/logo.png'

const genState = props => {
  const {
    loading = false,
    redirect = false,
    name = '',
    email = '',
    password = '',
    rePassword = '',
    invalidFeedBacks = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      rePassword: ''
    }
  } = props
  return {
    loading,
    redirect,
    name,
    email,
    password,
    rePassword,
    invalidFeedBacks
  }
}

class SignUp extends React.Component {
  state = genState(this.props)

  handleChange (type, event) {
    this.setState({
      [type]: event.target.value
    })
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    }
  }

  signUp = () => {
    this.setState({ loading: true })
    signUp({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      rePassword: this.state.rePassword
    }).then(token => {
      // save token
      setToken(token)

      // go to app route
      this.setRedirect()
    }).catch(error => {
      if (error.name === 'ValidationError') {
        this.setState({
          invalidFeedBacks: error.errors
        })
      } else if (error.name === 'UserDuplicateError') {
        this.setState({
          invalidFeedBacks: {
            email: 'This user is already exist!'
          }
        })
      }
    }).then(() => {
      this.setState({ loading: false })
    })
  }

  render () {
    return (
      <Fragment>
        { this.renderRedirect() }
        <div className="peers ai-s fxw-nw h-100p">
          <div className="peer peer-greed h-100 pos-r bgr-n bgpX-c bgpY-c bgsz-cv"
               style={{backgroundImage: `url(${backgroundImg})`}}>
            <div className="pos-a centerXY">
              <div className="bgc-white bdrs-50p pos-r" style={{width: '120px', height: '120px'}}>
                <img className="pos-a centerXY" src={logoImg} alt=""/>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 peer pX-40 pY-80 h-100 bgc-white scrollable pos-r" style={{'minWidth': '320px'}}>
            <h4 className="c-grey-900">Register</h4>
            <h6 className="c-grey-900 mB-40">Already have an account? <Link to='/login'>Sign in</Link></h6>

            <div>
              <div className="form-group">
                <FormInput
                  inputLabel={ 'Name' }
                  inputAriaLabel={ 'signUpFirstName' }
                  inputPlaceholder={ 'John'}
                  inputValue={ this.state.name }
                  invalidFeedback={ this.state.invalidFeedBacks.name }
                  onChange={ event => this.handleChange('name', event) }/>
              </div>
              <div className="form-group">
                <FormInput
                  inputLabel={ 'Email' }
                  inputAriaLabel={ 'signUpUsername' }
                  inputPlaceholder={ 'john@email.com'}
                  inputType={ 'email' }
                  inputValue={ this.state.email }
                  invalidFeedback={ this.state.invalidFeedBacks.email }
                  onChange={ event => this.handleChange('email', event) }/>
              </div>
              <div className="form-group">
                <FormInput
                  inputLabel={ 'Password' }
                  inputAriaLabel={ 'signUpPassword' }
                  inputType={ 'password' }
                  inputValue={ this.state.password }
                  invalidFeedback={ this.state.invalidFeedBacks.password }
                  onChange={ event => this.handleChange('password', event) }/>
              </div>
              <div className="form-group">
                <FormInput
                  inputLabel={ 'Repeat Password' }
                  inputAriaLabel={ 'signUpRePassword' }
                  inputType={ 'password' }
                  inputValue={ this.state.rePassword }
                  invalidFeedback={ this.state.invalidFeedBacks.rePassword }
                  onChange={ event => this.handleChange('rePassword', event) }/>
              </div>
              <div className="form-group">
                <button className="btn btn-primary" onClick={this.signUp}  disabled={this.state.loading}>
                  {
                    this.state.loading ? (<span className="spinner-border spinner-border-sm mR-5" role="status" aria-hidden="true"/>) : null
                  }
                  Register
                  {
                    this.state.loading ? '...' : null
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default SignUp
