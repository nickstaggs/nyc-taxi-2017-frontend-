import React from 'react';
import './App.css';
import Toolbar from './toolbar/Toolbar.js';
import Map from './map/Map.js';

class AppView extends React.Component {

  renderApp() {
    return (
      <div className="App">
        <Toolbar />
        <Map height={500} width={1000}/>
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
