import React from 'react';
import './../App.css';
import Rough from 'roughjs';
import *  as d3 from 'd3';

const styles = {
  width: "70%",
  height: "100%",
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
        <svg ref={node => this.node = this.props.map}
            width={500} height={500}>
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
  state = { loading: true };

  async componentDidMount() {

    let map = this.map;
    let rc = Rough.svg(map, {
      async: true,
      options: {
        simplification: 0.2, roughness: 0.65
      }
    });

    var w = 1000;
    var h = 600;

    //Define path generator
    var projection = d3.geoAlbers()
                          .center([1.5,40.7])
                          .rotate([75.527,0])
                          .parallels([41,44])
                          .translate([w/2,h/2])
                          .scale(79000);

    //Define path generator
    var path = d3.geoPath()
                     .projection(projection);

    d3.json("./nyc-map.json", function(json) {

      //var geojson = topojson.feature(json, json.objects.NycTaxiZones);
      //Bind data and create one path per GeoJSON feature

      var afterPeriod = /[^.]+$/;
      map.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         .attr("id", function(d) { return d.properties.locationid; })
         .attr("zone", function(d) { return d.properties.zone; })
         .attr("class", function(d) { return d.properties.borough; });

      this.setState( {loading: false, map});
    });
  }

  render() {
    return <MapView {...this.state} />;
  }
}

export default MapContainer;
