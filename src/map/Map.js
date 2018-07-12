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

  constructor(props) {
    super(props);
    this.updateD3(props);
  }

  componentWillUpdate(nextProps) {
    this.updateD3(nextProps);
  }

  updateD3(props) {
    const { map, width, height, zoomTransform, zoomType } = props;

    this.xScale = d3.scaleLinear()
                   .domain([0, d3.max(d3.values(map), ([x, y]) => x)])
                   .range([0, width]),
    this.yScale = d3.scaleLinear()
                   .domain([0, d3.max(d3.values(map), ([x, y]) => y)])
                   .range([0, height]);
 }

 get transform() {
    const { x, y, zoomTransform, zoomType } = this.props;
    let transform = "";

    if (zoomTransform && zoomType === "scale") {
      transform = `translate(${x + zoomTransform.x}, ${y + zoomTransform.y}) scale(${zoomTransform.k})`;
    }
    else{
      transform = `translate(${x}, ${y})`;
    }

    return transform;
  }

  render() {
    return (
      <g transform={this.transform} ref="scatterplot">
        {this.props.map}
      </g>
    )
  }
}

class MapContainer extends React.Component {


  state = { loading: true, map: [], zoomTransform: null };

  zoom = d3.zoom()
                .scaleExtent([-5, 5])
                .translateExtent([[-100, -100], [this.props.width+100, this.props.height+100]])
                .extent([[-100, -100], [this.props.width+100, this.props.height+100]])
                .on("zoom", this.zoomed.bind(this))

  componentDidMount() {
    // let map = this.state.map;
    // let rc = Rough.svg(map, {
    //   async: true,
    //   options: {
    //     simplification: 0.2, roughness: 0.65
    //   }
    //

    var projection = d3.geoAlbers()
                          .center([1.63,40.7])
                          .rotate([75.527,0])
                          .parallels([41,44])
                          .translate([this.state.width/2,this.state.height/2])
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

    d3.select(this.refs.svg)
      .call(this.zoom)
  }

  componentDidUpdate() {
    d3.select(this.refs.svg)
      .call(this.zoom)
  }

  zoomed() {
    this.setState({
      zoomTransform: d3.event.transform
    });
  }

  render() {
    const { zoomTransform } = this.state,
          { width, height } = this.props;

    return (
      <svg width={width} height={height} ref="svg">
        <MapView map={this.state.map}
                     x={0} y={0}
                     width={width}
                     height={height}
                     zoomTransform={zoomTransform}
                     zoomType="scale" />
      </svg>
    )
  }

  render() {
    const { width, height } = this.props;

    return (
      <svg width={width} height={height} ref="svg">
        <MapView {...this.state} />;
      </svg>
    )
  }
}

export default MapContainer;
