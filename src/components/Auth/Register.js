import React, { Component } from 'react'
import { Grid, Form, Segment, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Register extends Component {
  state = {}

  handleChange = () => {

  }

  render () {
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
                type='text'
                fluid
              />

              <Form.Input
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email'
                onChange={ this.handleChange }
                type='email'
                fluid
              />

              <Form.Input
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={ this.handleChange }
                type='password'
                fluid
              />

              <Form.Input
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={ this.handleChange }
                type='password'
                fluid
              />
            </Segment>
            <button className='ui orange button large'>Submit</button>
          </Form>
          <Message>Already a member? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
