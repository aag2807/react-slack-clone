import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class Login extends Component {
  render () {
    return (
      <div>Login
        <Link to="/register">Register</Link>
      </div>
    )
  }
}

export default Login
