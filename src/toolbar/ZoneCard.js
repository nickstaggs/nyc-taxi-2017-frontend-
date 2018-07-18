import React from 'react';
import './../App.css';

const styles = {

}

class ZoneCardView extends React.Component {
  renderZoneCard() {
    return (
      <div style={styles}>

      </div>
    );
  }
  render() {
    return this.renderZoneCard();
  }
}

class ZoneCardContainer extends React.Component {
  render() {
    return <ZoneCardView {...this.state} />;
  }
}

export default ZoneCardContainer;