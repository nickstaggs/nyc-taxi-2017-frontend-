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
import * as _ from 'lodash';
import MapContainer from '../map/Map';

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
                    {this.props.validationError ?
                        <p style={{color: 'red'}}>You must choose a specific zone for at least one of these.</p>
                        : 
                        null}
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
    state = {loading: false, error: false, routes: null, validationError: false};

    submit = () => {
        this.setState({loading : true });
        let routesUrl = "http://localhost:8080/api/routes?";

        if ((this.props.dropoffSelection === null || this.props.dropoffSelection.locationId === 0) && 
            (this.props.pickupSelection === null || this.props.pickupSelection.locationId === 0)) {

            this.setState({ loading: false, validationError: true });
            return;
        }

        let parameters = { dropoffLocationId: this.props.dropoffSelection, pickupLocationId: this.props.pickupSelection }
        let isFirstParameter = true;

        for (var parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
                if (parameters[parameter] !== null && parameters[parameter].locationId !== 0) {
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
                    if (routes.length === 1) {
                        this.props.updateChloroplethData(null);
                        this.setState({ loading: false, routes: routes, error: false });
                    }
                    else {
                        var totalRides = 0;
                        let data = new Map();

                        _.map(routes, (route, i) => {
                            totalRides = totalRides > route.totalRides ? totalRides : route.totalRides;

                            // Figure out which id to map to show color opacities for each zone
                            let id = ((parameters.dropoffLocationId !== null && parameters.dropoffLocationId.locationId !== 0)
                                ? route.pickupLocationId
                                : route.dropoffLocationId);
                            data.set(id, route.totalRides);
                        });


                        this.props.updateChloroplethData({data, totalRides});
                        this.setState({ loading: false, error: false, validationError: false });
                    }
                }
            )
            .catch(
                error => {
                    this.setState({ error: true, loading: false, validationError: false });
                }
            )

    }

    render() {
        return <ZoneCardView {...this.props} {...this.state} submit={this.submit} />;
    }
}

export default ZoneCardContainer;