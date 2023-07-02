import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    isUsernameError: false,
    isPasswordError: false,
    isLoginError: false,
  }

  // On Successful Login
  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    const {history} = this.props
    history.replace('/')
  }

  // On Login Failure
  onLoginFailure = errorMsg => {
    this.setState({errorMsg, isLoginError: true})
  }

  // On Form Submit
  onFormSubmit = async Event => {
    const {username, password} = this.state
    Event.preventDefault()
    this.validateForm()
    const userDetails = {
      username,
      password,
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(response)
    console.log(data)
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  // Form Validation
  validateForm = () => {
    const {username, password} = this.state

    if (username === '') {
      this.setState({isUsernameError: true})
    }
    if (password === '') {
      this.setState({isPasswordError: true})
    }
  }

  // Username Container
  getUsernameSection = () => {
    const {username, isUsernameError} = this.state

    // Update username to state
    const getUsernameValue = Event => {
      this.setState({username: Event.target.value})
    }

    // Username Empty Field Check
    const onBlurUsername = () => {
      if (username === '') {
        this.setState({isUsernameError: true})
      } else {
        this.setState({isUsernameError: false})
      }
    }

    //  Returning the Username Container
    return (
      <div className="input-container">
        <label htmlFor="username" className="label">
          USERNAME
        </label>
        <input
          type="text"
          className="input-box"
          id="username"
          placeholder="Username"
          value={username}
          onChange={getUsernameValue}
          onBlur={onBlurUsername}
        />
        {isUsernameError ? <p className="error-msg">*Required</p> : null}
      </div>
    )
  }

  // Password Container
  getPasswordSection = () => {
    const {password, isPasswordError} = this.state

    // Update Password to state
    const getPasswordValue = Event => {
      this.setState({password: Event.target.value})
    }

    // Password Empty Field Check
    const onBlurPassword = () => {
      if (password === '') {
        this.setState({isPasswordError: true})
      } else {
        this.setState({isPasswordError: false})
      }
    }

    //  Returning the Password Container
    return (
      <div className="input-container">
        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          type="password"
          className="input-box"
          id="password"
          placeholder="Password"
          value={password}
          onChange={getPasswordValue}
          onBlur={onBlurPassword}
        />
        {isPasswordError ? <p className="error-msg">*Required</p> : null}
      </div>
    )
  }

  render() {
    const loginPageImg =
      'https://res.cloudinary.com/amjay/image/upload/v1687973958/book.png'
    const altText = 'website login'
    const websiteLogo =
      'https://res.cloudinary.com/amjay/image/upload/v1687973956/Group_7731_xdkmqo.png'
    const websiteLogoAltText = 'login website logo'
    const {isLoginError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')

    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-login-container">
        <img className="login-page-img" src={loginPageImg} alt={altText} />
        <img
          className="sm-website-logo"
          src={websiteLogo}
          alt={websiteLogoAltText}
        />

        <div className="login-section">
          <div className="form-container">
            <form onSubmit={this.onFormSubmit}>
              <div className="website-logo-container">
                <img
                  className="md-website-logo"
                  src={websiteLogo}
                  alt={websiteLogoAltText}
                />
              </div>
              {this.getUsernameSection()}
              {this.getPasswordSection()}
              <button type="submit" className="login-button">
                Login
              </button>
              {isLoginError && <p className="error-msg">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
