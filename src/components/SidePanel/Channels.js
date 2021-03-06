import firebase from '../firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from   '../../actions'
import { Menu, Icon, Form, Input,Label, Grid } from 'semantic-ui-react';
import './UserPanel.css'


class Channels extends Component {

  state = {
    typingRef: firebase.database().ref('typing'),
    user: this.props.currentUser,
    channel: null,
    channels: [],
    channelName: '',
    channelDetail:'',
    messagesRef: firebase.database().ref('messages'),
    modal: false,
    channelsRef: firebase.database().ref('channels'),
    notifications: [],
    firstLoad: true,
    activeChannel: '',
  }

  componentWillUnmount(){
    this.removeListeners();
  }

  componentDidMount(){
    this.addListeners()
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  }

  changeChannel = (channel) => {
    const { user } = this.state
    this.setActiveChannel(channel);
    this.state.typingRef
      .child(this.state.channel.id)
      .child(user.uid)
      .remove()
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id)

    if(index !== -1 ){
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({notifications: updatedNotifications});
    }
  }

  setActiveChannel = (channel) => {
    this.setState({
      activeChannel: channel.id
    })
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  
  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel)
    this.setState({ channel: firstChannel });

    }
    this.setState({ firstLoad: false });
  };

  displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={()=> this.changeChannel(channel)}
        name={channel.name}
        style={{opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color='red'>{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
      )
    )
  )

  addChannel = () => {
    const { channelsRef, channelDetail, channelName, user } = this.state;
   
    const key = channelsRef.push().key;
    const newChannel = {
      id: channelName,
      name: channelName,
      details: channelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
    .child(key)
    .update(newChannel)
    .then(()=> {
      this.setState({
        channelName: '',
        channelDetail: ''
      })
        this.closeModal()
        console.log('channel added successfully')
        console.log(this.state.channels)
    })
    .catch(err => {
      console.error(err)
    })
  };

  handleSubmit = e => {
    e.preventDefault()
    if(this.isFormValid(this.state)){
      this.addChannel()
    }
  };

  isFormValid = ({ channelName, channelDetail }) =>{
    return channelName && channelDetail;
  };

  closeModal = () =>  {
    if(this.state.modal){
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
      document.getElementById('myForm').reset();
      this.setState({ modal: false })
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value})
  };

  openModal = () => {
    if(!this.state.modal){
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
      this.setState({ modal: true })
    }
  };

  render() {
    const { channels } = this.state
    return (
      <React.Fragment>
        <Menu.Menu className='menu'> 
          <Menu.Item> 
            <span>
              <Icon name='exchange'/> Channel
            </span>
            ({ channels.length}) <Icon name='add'
              onClick={this.openModal}
            />
          </Menu.Item>
          {/* Channels */}
         {this.displayChannels(channels)}
        </Menu.Menu>

          {/* add Channel Modal */}
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

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);