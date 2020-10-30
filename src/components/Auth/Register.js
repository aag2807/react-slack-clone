import React, { Component } from 'react'
import firebase from '../firebase'
import { Grid, Form, Segment, Header, Message, Icon,  } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import md5 from 'md5'

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  }

  isFormValid = () => {
    let errors = []
    let error;
    if(this.isFormEmpty(this.state)){
      error = { message: 'fill in all fields'}
      this.setState( { errors: errors.concat(error)})
      return false

    }else {
      return true;
    }
  }

  isFormEmpty = ({username, email, password, passwordConfirmation}) => {
    return !username.length || !email.length || !password.length ||
    !passwordConfirmation.length;
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

    if(this.isFormValid()) {
      this.setState({ errors: [], loading: true})
      firebase
        .auth()  
        .createUserWithEmailAndPassword( this.state.email, this.state.password )
        .then( createdUser => {
          console.log(createdUser);
          createdUser.user.updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved!!!')
                this.setState({ loading: false})
              })
          })
        })
        .catch(err => {
          console.error(err)
          this.setState({errors: this.state.errors.concat(err), loading: false})
        })
    }
  }
  
  /**
   * @param {Object} createdUser from return firebase createuser func
   * appends new user to firebase realtime database
   */
  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  }

  render () {
    const { 
      username, 
      email, 
      password, 
      passwordConfirmation, 
      errors,
      loading

    } = this.state

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

              <Form.Input
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={ this.handleChange }
                value={ passwordConfirmation }
                type='password'
                className={errors.some(error => error.message.toLowerCase().includes('password')) ? 'error' :
                  '' }
                fluid
              />
            </Segment>
            <button onClick={this.handleSubmit} disabled={loading} className={loading ? 'loading ui orange button large': ' ui orange button large'} >Submit</button>
          </Form>
          {errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
          )}
          <Message>Already a member? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
