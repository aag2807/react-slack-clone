import firebase from '../firebase'
import React, { Component } from 'react'
import { Grid, Form, Segment, Header, Message, Icon,  } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  }




  displayErrors = (errors) => {
    return errors.map((err, i) => {
      return (
        <p key={i}>{err.message}</p>
      )
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if(this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true})
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser)
          this.setState({ errors: [], loading: false})

        })
        .catch(err => {
          console.error(err)
          this.setState({
            errors: this.state.errors.concat(err)
          })
          this.setState({ loading: false })
        })
    }
  }
  
  isFormValid = ({ email, password }) => {
      return email && password
  }

  render () {
    const { 
      email, 
      password, 
      errors,
      loading

    } = this.state
    return (
      <Grid textAlign='center' verticalAlign='middle' className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='violet' textAlign='center'>
            <Icon name='code branch' color='violet' />
            Login to RackChat
          </Header>
          <Form size='large'>
            <Segment stacked>

              <Form.Input
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email'
                onChange={ this.handleChange }
                value={ email }
                className={errors.some(error => error.message.toLowerCase().includes('email')) ? 'error' :
                  '' }
                type='email'
                fluid
              />

              <Form.Input
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={ this.handleChange }
                value={ password }
                type='password'
                className={errors.some(error => error.message.toLowerCase().includes('password')) ? 'error' :
                  '' }
                fluid
              />


            </Segment>
            <button onClick={this.handleSubmit} disabled={loading} className={loading ? 'loading ui orange button large': ' ui violet button large'} >Submit</button>
          </Form>
          {errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
          )}
          <Message>
          Don't have an account? <Link to="/register">Register</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
