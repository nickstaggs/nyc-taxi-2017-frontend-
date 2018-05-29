import React from 'react';
import './../App.css';

const styles = {

}

class CardsView extends React.Component {
  renderCards() {
    return (
      <div style={styles}>

      </div>
    );
  }
  render() {
    return this.renderCards();
  }
}

class CardsContainer extends React.Component {
  render() {
    return <CardsView {...this.state} />;
  }
}

export default CardsContainer;
