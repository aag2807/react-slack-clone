import firebase from '../firebase';
import React, { Component } from 'react';
import { Menu, Icon, Form, Input,Label, Grid } from 'semantic-ui-react';
import './UserPanel.css'


class Channels extends Component {

  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetail:'',
    modal: false,
    channelsRef: firebase.database().ref('channels'),

  }

  addChannel = () => {
    const { channelsRef, channelDetail, channelName, user } = this.state;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };
    channelsRef
    .child('key')
    .update(newChannel)
    .then(()=> {
      this.setState({
        channelName: '',
        channelDetail: ''
      })
        this.closeModal()
        console.log('channel added successfully')
    })
    .catch(err => {
      console.error(err)
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if(this.isFormValid(this.state)){
      this.addChannel()
    }
  }

  isFormValid = ({ channelName, channelDetail }) =>{
    return channelName && channelDetail;
  }

  closeModal = () =>  {
    if(this.state.modal){
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
      document.getElementById('myForm').reset();
      this.setState({ modal: false })
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value})
  }

  openModal = () => {
    if(!this.state.modal){
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
      this.setState({ modal: true })
    }
  }

  render() {
    const { channels } = this.state
    return (
      <React.Fragment>

        <Menu.Menu style={{ paddingBottom: '2em'}}> 
          <Menu.Item> 
            <span>
              <Icon name='exchange'/> Channel
            </span>
            ({ channels.length}) <Icon name='add'
              onClick={this.openModal}
            />
          </Menu.Item>
        </Menu.Menu>

        <div id='myModal' className='ui modal grey'>
            <div className='header'> Add a Channel</div>
            <div className='modal-content'>
              <Form id="myForm" onSubmit={this.handleSubmit}>
                <Form.Field>
                  <Label as='p' pointing='below'>Channel Name</Label>
                  <Input 
                    fluid
                    name='channelName'
                    onChange={this.handleChange}
                  />
                  <Label as='p' pointing='below'>Channel Details</Label>
                  <Input 
                  fluid
                  name='channelDetail'
                  onChange={this.handleChange}
                />
                </Form.Field>
              </Form>
              <br />
              <Grid columns={2} >
                <Grid.Column>
                  <button
                    size='mini' 
                    onClick={this.handleSubmit}
                    className={'ui green button large inverted'} >
                    <Icon name='checkmark'/> Add
                  </button>
                </Grid.Column>
                <Grid.Column>
                  <button
                    size='mini' 
                    onClick={this.closeModal}
                    className={'ui red button large inverted'} >
                    <Icon name='remove'/> Cancel
                  </button>
                </Grid.Column>
              </Grid>
              </div>
            <div>
          </div>
        </div>
        </React.Fragment>
    );
  }
}

export default Channels;