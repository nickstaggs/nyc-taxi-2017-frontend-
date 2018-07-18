import React from 'react';
import './../App.css';

const styles = {
  width: "30%",
  height: "100%",
  position: "fixed",
  backgroundColor: "black",
  color: "white",
  float: "left"
}

class ToolbarView extends React.Component {

  renderToolbar() {
    return (
      <div style={styles}>
        <h2>NYC Yellow Taxi 2017 Data</h2>
        
      </div>
    );
  }

  render() {
    return this.renderToolbar();
  }
}

class ToolbarContainer extends React.Component {

  render() {
    return <ToolbarView {...this.state} />;
  }
}

export default ToolbarContainer;
