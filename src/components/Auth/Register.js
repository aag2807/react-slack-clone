import React, { Component } from 'react'
import firebase from '../firebase'
import { Grid, Form, Segment, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()

    firebase
      .auth()  
      .createUserWithEmailAndPassword( this.state.email, this.state.password )
      .then( createdUser => {
        console.log( createdUser )
      })
      .catch(err => {
        console.error(err)
      })
  }


  render () {
    const { username, email, password, passwordConfirmation } = this.state

    return (
      <Grid textAlign='center' verticalAlign='middle' className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange' />
            Register for RackChat
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={ this.handleChange }
                value={ username }
                type='text'
                fluid
              />

              <Form.Input
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email'
                onChange={ this.handleChange }
                value={ email }
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
                fluid
              />

              <Form.Input
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={ this.handleChange }
                value={ passwordConfirmation }
                type='password'
                fluid
              />
            </Segment>
            <button onClick={this.handleSubmit} className='ui orange button large'>Submit</button>
          </Form>
          <Message>Already a member? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
