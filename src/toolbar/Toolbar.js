import React from 'react';
import './../App.css';
import ZoneCard from './ZoneCard.js';

const styles = {
  width: "30%",
  height: "100%",
  position: "fixed",
  backgroundColor: "lightyellow",
  color: "black",
  float: "left",
  borderRightStyle: "solid",
  borderColor: "black"
}

class ToolbarView extends React.Component {

  renderToolbar() {
    return (
      <div style={styles}>
        <h2>NYC Yellow Taxi 2017 Data</h2>
        <ZoneCard {...this.props} />
      </div>
    );
  }

  render() {
    return this.renderToolbar();
  }
}

class ToolbarContainer extends React.Component {

  render() {
    return  <ToolbarView {...this.props} />;
  }
}

export default ToolbarContainer;
