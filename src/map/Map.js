import React from 'react';
import './../App.css';
import Rough from 'roughjs';
import *  as d3 from 'd3';
import * as _ from 'lodash';
import Nyc from './nyc-map'

const styles = {
  width: "70%",
  height: "98.25vh",
  float: "right"
}

class MapView extends React.Component {

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return <div>Error: {this.props.error}</div>;
  }

  renderMap() {

    return (
      <div id="map" style={styles}>
        <svg id="nyc-map" height="100%" width="100%">
          {this.props.map}
        </svg>
      </div>
    );
  }

  render() {

    if (this.props.loading) {
      return this.renderLoading();
    }
    else if (this.props.map){
      return this.renderMap();
    }
    else {
      return this.renderError();
    }
  }
}

class MapContainer extends React.Component {
  state = { loading: true, map: [] };

  componentDidMount() {

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
                          .center([1.63,40.7])
                          .rotate([75.527,0])
                          .parallels([41,44])
                          .translate([w/2,h/2])
                          .scale(79000);

    //Define path generator
    var path = d3.geoPath()
                     .projection(projection);

    let zones = _.map(Nyc.features, (feature, i) => {

      // generate the SVG path from the geometry
      // let p = rc.path(path(feature));
      let p = path(feature);
      return <path d={p} key={i} locationid={feature.properties.locationid}
                            zone={feature.properties.zone}
                            className={feature.properties.borough}/>;
    });

    this.setState( {loading: false, map: zones});
  }

  render() {
    return <MapView {...this.state} />;
  }
}

export default MapContainer;
