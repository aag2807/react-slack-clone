import React, { Component } from 'react';
import { Menu, Divider, Sidebar, Button } from 'semantic-ui-react';

class ColorPanel extends Component {

  render() {
    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
      <Divider />
      <Button icon='add' size='small' />
      </Sidebar>
    )
  }
}

export default ColorPanel;