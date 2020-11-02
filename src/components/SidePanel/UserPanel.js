import firebase from '../firebase'
import React, { Component } from 'react'
import { Grid, Header, Icon, Image } from 'semantic-ui-react'

class UserPanel extends Component {

  state = {
    user: this.props.currentUser
  }


  handleSignOut = () =>{
    firebase
      .auth()
      .signOut()
      .then(() => console.log('Signed Out!'))
  }

  render() {
    const { user } = this.state
    return (
      <Grid style={{ background: '#4c3c4c'}}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: '0'}}>
        {/* App Header*/}  
            <Header inverted floated='left' as='h2'>
              <Icon name='code'/>
              <Header.Content>RackChat</Header.Content>
            </Header>
          </Grid.Row>

        {/* User Dropdown */}
          <Header style={{ padding: '0.25em'}} as='h4' inverted>
            <div className='ui dropdown'>
              <div className='text' style={ {paddingLeft: '20px',paddingBottom: '15px'}}>
                 <Image src={user.photoURL} space='right' avatar/>
                {user.displayName}
              </div>
                <div className='item hovered'>
                <span style={{cursor:'pointer'}}>Sign in as{" "} <strong>{user.displayName}</strong></span></div>
                <div className='item hovered'><span style={{cursor:'pointer'}}>Change Avatar</span></div>
                <div className='item hovered'><span style={{cursor:'pointer'}} onClick={this.handleSignOut}>Sign out</span></div>
            </div>
          </Header>

        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;