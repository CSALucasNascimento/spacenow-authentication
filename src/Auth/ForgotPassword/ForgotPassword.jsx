import React from 'react'
import './ForgotPassword.scss'
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
    const username = this.props.authData;
    if (!username) {
      this.setState({ error: 'missing username' });
      return;
    }
    const { code, password } = this.inputs;
    Auth.forgotPasswordSubmit(username, code, password)
        .then((data) => this.handleSuccess(username, data))
        .catch(err => this.handleError(err))
  }

  handleSuccess = (username, data) => {
    this.getInitialState();
    this.changeState('signIn', username);
  }

  handleError = (err) => {
    let message = err.message || err
    this.setState({ error: message })
  }

  render() {

    const { authState } = this.props;
    if (authState !== 'forgotPasswordReset') { return null; }

    const { error } = this.state;
    
    return (
      <div className="signup">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Code</label>
            <input type="text" name="code" className="form-control" placeholder="Code" onChange={this.handleChange} required />
            <div className="invalid-feedback">
                Please insert the code.
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" placeholder="Password" onChange={this.handleChange} required />
            <div className="invalid-feedback">
                Please choose a password.
            </div>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => this.changeState('forgotPassword')} required>
            Back to Forgot Password
          </button>
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
          { error && <div className="alert alert-danger fixed-bottom" role="alert">{error}</div> }
        </form>
      </div>
    );
  }
}

export default ForgotPassword
