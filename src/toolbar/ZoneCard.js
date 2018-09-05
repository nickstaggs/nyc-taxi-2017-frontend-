import React from 'react';
import './../App.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import AutoCompleteDropdown from './AutoCompleteDropdown.js';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography'

const styles = {
  margin:'5%',
  overflow: 'visible'
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

  pickupSelected = () => {this.props.pickupSelection !== null;}

  dropoffSelected = () => { this.props.dropoffSelection !== null; }

  renderZoneCard() {
    return (
      <Card style={styles}>
        
        <CardContent style={contentStyles}>
          {this.pickupSelected ? 
            <AutoCompleteDropdown label='Pickup' style={flexStyles} selection={this.props.pickupSelection} />
            :
            <AutoCompleteDropdown label='Pickup' style={flexStyles}/>}
          <Icon style={arrowStyles}>arrow_forward</Icon>
          {this.dropoffSelected ?
            <AutoCompleteDropdown label='Dropoff' style={flexStyles} selection={this.props.dropoffSelection} />
            :
            <AutoCompleteDropdown label='Dropoff' style={flexStyles} />}
        </CardContent>
        <CardContent>
          <p>
            Press Submit to see data for the selected route.
          </p>
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
    return <ZoneCardView pickupSelection={this.props.pickupSelection} dropoffSelection={this.props.dropoffSelection} />;
  }
}

export default ZoneCardContainer;