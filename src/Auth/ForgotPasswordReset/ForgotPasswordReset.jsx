import React from 'react'
import './ForgotPasswordReset.scss'
import { Auth } from 'aws-amplify'

class ForgotPassword extends React.Component {

  constructor(props) {
    super(props)
    this.inputs = {}
    this.state = this.getInitialState()
  }

  getInitialState = () => ({
    error: ''
  })

  changeState(state, data) {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data)
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.inputs[name] = value
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const username = this.props.authData || this.inputs.username;
    Auth.forgotPassword(username)
        .then(() => this.handleSuccess(username))
        .catch(err => this.handleError(err))
  }

  handleSuccess = (username) => {
    this.getInitialState();
    this.changeState('forgotPasswordReset', username);
  }

  handleError = (err) => {
    let message = err.message || err
    this.setState({ error: message })
  }

  render() {

    const { authState } = this.props;
    if (authState !== 'forgotPassword') { return null; }

    const { error } = this.state;
    
    return (
      <div className="signup">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" className="form-control" placeholder="Username" onChange={this.handleChange} required />
            <div className="invalid-feedback">
                Please choose an username.
            </div>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => this.changeState('signIn')}>
            Back to SignIn
          </button>
          <button type="submit" className="btn btn-primary">
            Send password reset code
          </button>
          { error && <div className="alert alert-danger fixed-bottom" role="alert">{error}</div> }
        </form>
      </div>
    );
  }
}

export default ForgotPassword
