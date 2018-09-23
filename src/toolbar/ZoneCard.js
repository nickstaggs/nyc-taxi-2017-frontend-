import React from 'react';
import './../App.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import AutoCompleteDropdown from './AutoCompleteDropdown.js';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions';
import SubmitButton from './SubmitButton';

const styles = {
    margin: '5%',
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

    pickupSelected = () => { this.props.pickupSelection !== null; }

    dropoffSelected = () => { this.props.dropoffSelection !== null; }

    renderZoneCard() {
        var rows = [];
        if (this.props.routes != null) {
            for(var key in this.props.routes) {
                rows.push(<p key={key}>Total rides is {this.props.routes[key].totalRides}</p>)
            }
        }

        return (
            <Card style={styles}>

                <CardContent style={contentStyles}>
                    {this.pickupSelected ?
                        <AutoCompleteDropdown label='Pickup' style={flexStyles} selection={this.props.pickupSelection} updateSelection={this.props.updatePickupSelection} />
                        :
                        <AutoCompleteDropdown label='Pickup' style={flexStyles} />}
                    <Icon style={arrowStyles}>arrow_forward</Icon>
                    {this.dropoffSelected ?
                        <AutoCompleteDropdown label='Dropoff' style={flexStyles} selection={this.props.dropoffSelection} updateSelection={this.props.updateDropoffSelection}/>
                        :
                        <AutoCompleteDropdown label='Dropoff' style={flexStyles} />}
                </CardContent>
                <CardContent>
                    {
                        this.props.loading 
                        ? <p>...Loading</p> 
                        : (

                            this.props.error
                            ? <p>Oops... Something went wrong</p>
                            : (

                                this.props.routes == null
                                ? <p>Press Submit to see data for the selected route.</p>
                                : <div>{rows}</div>
                            )
                        )
                    }
                </CardContent>
                <CardActions>
                    <SubmitButton onClick={this.props.submit}/>
                </CardActions>
            </Card>
        );
    }

    render() {
        return this.renderZoneCard();
    }
}

class ZoneCardContainer extends React.Component {
    state = {loading: false, error: false, routes: null};

    submit = () => {
        this.setState({loading : true });
        let routesUrl = "http://localhost:8080/api/routes?";
        let parameters = { dropoffLocationId: this.props.dropoffSelection, pickupLocationId: this.props.pickupSelection }
        let isFirstParameter = true;

        for (var parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
                if (parameters[parameter].locationId != 0) {
                    if (!isFirstParameter) {
                        routesUrl += "&"
                    }

                    routesUrl += parameter + "=" + parameters[parameter].locationId;

                    isFirstParameter = false;
                }
            }
        }

        fetch(routesUrl)
            .then(res => res.json())
            .then(
                routes => {
                    this.setState({loading : false, routes: routes});
                }
            )
            .catch(
                error => {
                    this.setState({error : true, loading : false});
                }
            )

    }

    render() {
        return <ZoneCardView {...this.props} {...this.state} submit={this.submit} />;
    }
}

export default ZoneCardContainer;