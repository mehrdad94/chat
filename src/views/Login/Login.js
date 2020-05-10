import React, { Fragment } from 'react'
import { Redirect, Link } from 'react-router-dom'
import FormInput from '../../components/FormInput/FormInput'
import { login, setToken } from '../../api'
import backgroundImg from '../../static/images/bg.jpg'
import logoImg from '../../static/images/logo.png'

const genState = props => {
  const {
    loading = false,
    redirect = false,
    email = '',
    password = '',
    invalidFeedBacks = {
      email: '',
      password: ''
    }
  } = props
  return {
    loading,
    redirect,
    email,
    password,
    invalidFeedBacks
  }
}

class Login extends React.Component {
  state = genState(this.props)

  handleChange = (type, event) => {
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
    } else return null
  }

  login = () => {
    this.setState({ loading: true })
    login({ email: this.state.email, password: this.state.password }).then(token => {
      // save token
      setToken(token)

      // go to app route
      this.setRedirect()
    }).catch(error => {
      if (error.name === 'ValidationError') {
        this.setState({
          invalidFeedBacks: error.errors
        })
      } else if (error.name === 'AuthenticationError') {
        this.setState({
          invalidFeedBacks: {
            email: 'Wrong user name or password!',
            password: 'Wrong user name or password!'
          }
        })
      }
    }).then(() => {
      this.setState({ loading: false })
    })
  }

  componentWillMount () {
    this.setState(genState(this.props))
  }

  render() {
    return (
      <Fragment>
        { this.renderRedirect() }

        <div className="peers ai-s fxw-nw h-100vh">
          <div className="d-n@sm- peer peer-greed h-100 pos-r bgr-n bgpX-c bgpY-c bgsz-cv"
               style={{backgroundImage: `url(${backgroundImg})`}}>
            <div className="pos-a centerXY">
              <div className="bgc-white bdrs-50p pos-r" style={{width: '120px', height: '120px'}}>
                <img className="pos-a centerXY" src={logoImg} alt="logo"/>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 peer pX-40 pY-80 h-100 bgc-white scrollable pos-r" style={{'minWidth': '320px'}}>
            <h4 className="c-grey-900">Login</h4>
            <h6 className="c-grey-900 mB-40">New user? <Link to='/signup'>Create an account</Link></h6>
            <div>
              <div className="form-group">
                <FormInput
                  inputLabel={ 'Email' }
                  inputAriaLabel={ 'loginUsername' }
                  inputPlaceholder={ 'john@email.com'}
                  inputType={ 'email' }
                  inputValue={ this.state.email }
                  invalidFeedback={ this.state.invalidFeedBacks.email }
                  onChange={ event => this.handleChange('email', event) }/>
              </div>

              <div className="form-group">
                <FormInput
                  inputLabel={ 'Password' }
                  inputAriaLabel={ 'loginPassword' }
                  inputType={ 'password' }
                  inputPlaceholder={ '********' }
                  inputValue={ this.state.password }
                  invalidFeedback={ this.state.invalidFeedBacks.password }
                  onChange={ event => this.handleChange('password', event) }/>
              </div>

              <div className="form-group">
                <div className="peers ai-c jc-sb fxw-nw">
                  <div className="peer">
                    <button className="btn btn-primary" onClick={this.login} disabled={this.state.loading}>
                      {
                        this.state.loading ? (<span className="spinner-border spinner-border-sm mR-5" role="status" aria-hidden="true"/>) : null
                      }
                      Login
                      {
                        this.state.loading ? '...' : null
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Login