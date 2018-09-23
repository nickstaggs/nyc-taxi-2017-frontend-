import React from 'react';
import './../App.css';
import Rough from 'roughjs';
import *  as d3 from 'd3';
import * as _ from 'lodash';
import Nyc from './nyc-map'

const styles = {
    width: "70%",
    height: "100vh",
    float: "right",
    overflow: "hidden"
}

class MapView extends React.Component {

    renderLoading() {
        return <div>Loading...</div>;
    }

    renderError() {
        return <div>Error: {this.props.error}</div>;
    }

    componentDidUpdate() {
        var svg = d3.select("svg");

        this.zoom = d3.zoom()
            .scaleExtent([.75, 8])
            .on("zoom", this.zoomed);

        svg.call(this.zoom);
    }

    zoomed() {
        var g = d3.select("g");

        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }

    renderMap() {

        return (
            <div id="map" style={styles}>
                <svg id="nyc-map" height="100%" width="100%">
                    <g>{this.props.map}</g>
                </svg>
            </div>
        );
    }

    render() {

        if (this.props.loading) {
            return this.renderLoading();
        }
        else if (this.props.map) {
            return this.renderMap();
        }
        else {
            return this.renderError();
        }
    }
}

class MapContainer extends React.Component {
    state = { loading: true, map: [], pickupLastSelected: false };

    //   componentDidUpdate(prevProps) {
    //       if (prevProps.pickupSelection !== this.props.pickupSelection) {
    //           if (this.props.pickupSelection !== null) {
    //               this.state.map[this.props.pickupSelection.key].props.className = 'selected'
    //           }
    //       }

    //       if (prevProps.dropoffSelection !== this.props.dropoffSelection) {
    //           if (this.props.dropoffSelection !== null) {
    //               this.state.map[this.props.dropoffSelection.key].props.className = 'selected'
    //           }
    //       }
    //   }

    componentDidUpdate(prevProps) {
        
        if (prevProps.pickupSelection !== this.props.pickupSelection || 
            prevProps.dropoffSelection !== this.props.dropoffSelection) {

            this.buildMap();
        }
    }

    componentDidMount() {

        this.buildMap();
    }

    isSelected = (key) => 
        ((this.props.dropoffSelection !== null && key === this.props.dropoffSelection.locationId) ||
        (this.props.pickupSelection !== null && key === this.props.pickupSelection.locationId));

    updateSelection = (zone) => {
        if (!this.state.pickupLastSelected) {
            this.props.updatePickupSelection(zone);
            this.setState({ pickupLastSelected: true });
        }
        else {
            this.props.updateDropoffSelection(zone);
            this.setState({ pickupLastSelected: false });
        }
    }

    buildMap = () => {
        // let map = this.state.map;
        // let rc = Rough.svg(map, {
        //   async: true,
        //   options: {
        //     simplification: 0.2, roughness: 0.65
        //   }
        // });

        var w = 1000;
        var h = 600;

        var projection = d3.geoAlbers()
            .center([1.63, 40.7])
            .rotate([75.527, 0])
            .parallels([41, 44])
            .translate([w / 2, h / 2])
            .scale(79000);

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);

        let zones = _.map(Nyc.features, (feature, i) => {

            let p = path(feature);
            return <path d={p} onClick={() => this.updateSelection({ label: feature.properties.zone, locationId: feature.properties.locationid })} key={i} locationid={feature.properties.locationid}
                zone={feature.properties.zone}
                className={this.isSelected(feature.properties.locationid) ? "selected" : feature.properties.borough}>
                <title>{feature.properties.zone}</title>
            </path>;
        });

        this.setState({ loading: false, map: zones });
    }

    render() {
        return <MapView {...this.state} />;
    }
}

export default MapContainer;
