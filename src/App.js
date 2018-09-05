import React from 'react';
import './App.css';
import Toolbar from './toolbar/Toolbar.js';
import Map from './map/Map.js';

const styles = {
  color: "blue"
}

class AppView extends React.Component {

  renderApp() {
    return (
      <div style={styles} className="App">
        <Toolbar pickupSelection={this.props.pickupSelection} dropoffSelection={this.props.dropoffSelection}/>
        <Map updateSelection={this.props.updateSelection} />
      </div>
    );
  }

  render() {
    return this.renderApp();
  }
}

class AppContainer extends React.Component {

  state = { pickupSelection: null, dropoffSelection: null, pickupLastSelected: false}

  updateSelection = (zone) => {
    if (!this.state.pickupLastSelected) {
      this.setState({ pickupSelection: zone });
      this.setState({ pickupLastSelected : true });
    }
    else {
      this.setState({ dropoffSelection: zone });
      this.setState({ pickupLastSelected: false });
    }
  }

  render() {
    return <AppView {...this.state} updateSelection={this.updateSelection} />;
  }
}

export default AppContainer;
