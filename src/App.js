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
        <Toolbar />
        <Map />
      </div>
    );
  }

  render() {
    return this.renderApp();
  }
}

class AppContainer extends React.Component {

  render() {
    return <AppView {...this.state} />;
  }
}

export default AppContainer;
