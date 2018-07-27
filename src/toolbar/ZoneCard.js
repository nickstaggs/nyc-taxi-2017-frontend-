import React from 'react';
import './../App.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import AutoCompleteDropdown from './AutoCompleteDropdown.js';
import Icon from '@material-ui/core/Icon';

const styles = {
  margin:"5%"
}

const flexStyles = {
  flexShrink: 1
}

const arrowStyles = {
  flexShrink: 1,
  marginTop: '3%'
}

const contentStyles = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between'
}

class ZoneCardView extends React.Component {

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return <div>I'm sorry please try again.</div>;
  }

  renderZoneCard() {
    return (
      <Card style={styles}>
        
        <CardContent style={contentStyles}>
          <AutoCompleteDropdown label='Pickup' style={flexStyles}/>
          <Icon style={arrowStyles}>arrow_forward</Icon>
          <AutoCompleteDropdown label='Dropoff' style={flexStyles}/>
        </CardContent>
      </Card>
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