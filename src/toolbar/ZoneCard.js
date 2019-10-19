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

    pickupSelected = () => { return this.props.pickupSelection !== null; }

    dropoffSelected = () => { return this.props.dropoffSelection !== null; }


    renderZoneCard() {
        const defaultMessage = "Select zones in the dropdown above or by clicking on them on the map. " +
                                "Then click submit to see data for the selected route.";

        let dropDowns = (
            <div>
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
            </div>
        );

        let message = (
            <div className="message">
                {
                    this.props.loading 
                    ? <p>...Loading</p> 
                    : (

                        this.props.error
                        ? <p>Oops... Something went wrong</p>
                        : (
                            this.props.validationError 
                            ? null
                            : (
                                this.props.message === null
                                ? <p>{defaultMessage}</p>
                                : <div>{this.props.message}</div>
                            )
                        )
                    )
                }
            </div>
        );

        return (
            <div>

                {
                    this.props.isMobile 
                    ? <div>
                        <div className="mobile-submit">
                            <SubmitButton onClick={this.props.submit}  />   
                        </div>
                        
                        {dropDowns}
                        {message}
                    </div>

                    : <Card style={styles}>

                        <CardContent style={contentStyles}>
                            {dropDowns}
                        </CardContent>
                        <CardContent>
                            {message}
                        </CardContent>
                        <CardActions>
                            <SubmitButton onClick={this.props.submit}/>
                        </CardActions>
                    </Card>
                    
                    
                }
            </div>
        );
    }

    render() {
        return this.renderZoneCard();
    }
}

class ZoneCardContainer extends React.Component {
    state = {
        loading: false, 
        error: false, 
        message: null, 
        validationError: false, 
        mq: window.matchMedia('(max-width: 1024px)'),
        isMobile: window.matchMedia('(max-width: 1024px)').matches
    };

    constructor(props) {
        super(props);
        this.state.mq.addListener(e => {
            this.setState({isMobile: e.matches});
        });
    }

    isMobile = (mq) => {
        return mq.matches;
    }

    isSpecificZone = (zone) => {
        return zone !== null && zone.locationId !== 0;
    }

    createChoroplethMessage = (maxRides, totalRides, zoneName, isDroppedOff) => {
        return "This is a choropleth map in which zones are shaded relative to the maximum number of rides "
            + (isDroppedOff ? "dropped off " : "picked up ")
            + "in the " + zoneName + " zone and "
            + (!isDroppedOff ? "dropped off " : "picked up ")
            + "in another zone "
            + "which is " + maxRides.toLocaleString(undefined, { minimumFractionDigits: 0 }) + ". "
            + "The total number of rides "
            + (isDroppedOff ? "dropped off " : "picked up ")
            + "in the " + zoneName + " zone "
            + "is " + totalRides.toLocaleString(undefined, { minimumFractionDigits: 0 }) + ".";
    }

    submit = () => {
        this.setState({loading : true }); 
        let routesUrl = process.env.REACT_APP_API_URL + "/routes?";

        if ((this.props.dropoffSelection === null || this.props.dropoffSelection.locationId === 0) && 
            (this.props.pickupSelection === null || this.props.pickupSelection.locationId === 0)) {

            this.setState({ loading: false, validationError: true, message: null });
            return;
        }

        let queryParameters = { dropoffLocationId: this.props.dropoffSelection, pickupLocationId: this.props.pickupSelection }
        let isFirstParameter = true;

        for (var parameter in queryParameters) {
            if (queryParameters.hasOwnProperty(parameter)) {
                if (this.isSpecificZone(queryParameters[parameter])) {
                    if (!isFirstParameter) {
                        routesUrl += "&"
                    }

                    routesUrl += parameter + "=" + queryParameters[parameter].locationId;

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
                        var rows = [];
                        
                        for (var key in routes) {
                            rows.push(<p key={key}>The total number of rides is {routes[key].totalRides.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>)
                        }

                        this.setState({ loading: false, error: false, message: rows });
                    }
                    else {
                        var maxRides = 0;
                        var totalRides = 0;
                        const isDropOff = this.isSpecificZone(queryParameters.dropoffLocationId);
                        let data = new Map();

                        _.map(routes, (route, i) => {
                            maxRides = maxRides > route.totalRides ? maxRides : route.totalRides;
                            totalRides += route.totalRides;

                            // Figure out which id to map to show color opacities for each zone
                            let id = isDropOff
                                ? route.pickupLocationId
                                : route.dropoffLocationId;
                            data.set(id, route.totalRides);
                        });

                        var zoneName = isDropOff
                            ? queryParameters.dropoffLocationId.label
                            : queryParameters.pickupLocationId.label;

                        var choroplethMessage = this.createChoroplethMessage(maxRides, totalRides, zoneName, isDropOff);

                        this.props.updateChloroplethData({data, maxRides});
                        this.setState({ loading: false, error: false, validationError: false, message: choroplethMessage });
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
        return <ZoneCardView {...this.props} {...this.state} submit={this.submit} isMobile={this.state.isMobile} />;
    }
}

export default ZoneCardContainer;