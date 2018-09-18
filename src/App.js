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
        <Toolbar {...this.props}/>
        <Map {...this.props} />
      </div>
    );
  }

  render() {
    return this.renderApp();
  }
}

class AppContainer extends React.Component {

  state = { pickupSelection: null, dropoffSelection: null}

  updatePickupSelection = (zone) => {
    this.setState({ pickupSelection : zone});
  }

  updateDropoffSelection = (zone) => {
    this.setState({ dropoffSelection : zone });
  }

  render() {
    return <AppView {...this.state} updatePickupSelection={this.updatePickupSelection} 
                                    updateDropoffSelection={this.updateDropoffSelection} />;
  }
}

export default AppContainer;
