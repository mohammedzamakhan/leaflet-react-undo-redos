import React, { Component } from "react";
import { connect } from "react-redux";
import { addPoints, updateRectangle } from "./store";
import UndoRedo from "./UndoRedo";
import cloneDeep from "lodash/cloneDeep";
const DEFAULT_TEMP = {
  past: [],
  present: undefined,
  future: [],
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.tempLayers = DEFAULT_TEMP;
    this.state = {
      undoredo: {
        undo: false,
        redo: false,
      },
    };
  }
  componentDidMount() {
    this.map = new L.Map(this.mapNode, {}).setView([51.505, -0.09], 22);
    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken:
          "pk.eyJ1IjoibW9oYW1tZWR6YW1ha2hhbiIsImEiOiJjamtuMzMza28yaW8yM3dreDluenF5c2RsIn0.K9hm3Kxsu0BRhqAzM_JfrQ",
      },
    ).addTo(this.map);
    // define toolbar options
    var options = {
      position: "topleft",
      drawMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: true,
      drawCircle: false,
      cutPolygon: false,
      editMode: true,
      removalMode: true,
    };

    // add leaflet.pm controls to the map
    this.map.pm.addControls(options);

    this.map.on("pm:drawstart", e => {
      this.workinglayer = e.workingLayer;
      this.tempLayers = DEFAULT_TEMP;
      this.props.dispatch(updateRectangle(cloneDeep(e.workingLayer)));
      this.workinglayer.on("pm:vertexadded", e => {
        if (this.state.tempLayers.past.length) {
          this.setState({
            undoredo: {
              ...this.state.undoredo,
              undo: true,
            },
          });
        }
        if (this.tempLayers.present) {
          this.tempLayers.past.push(this.tempLayers.present);
        }
        this.tempLayers.present = {
          layer: cloneDeep(e.workingLayer),
          marker: cloneDeep(e.marker),
        };
      });
    });
  }

  handleUndo = () => {
    this.map.pm.Draw.Poly._layerGroup.removeLayer(
      this.tempLayers.present.marker,
    );
    const poppedElement = this.tempLayers.past.pop();
    this.tempLayers.present = poppedElement;
    this.workinglayer.setLatLngs(this.tempLayers.present.layer.getLatLngs());
  };

  handleRedo = () => {};

  render() {
    return [
      <div id="map" ref={ref => (this.mapNode = ref)} />,
      <UndoRedo
        isUndoable={this.state.undoredo.undo}
        isRedoable={this.state.undoredo.redo}
        onUndo={this.handleUndo}
        onRedo={this.handleRedo}
      />,
    ];
  }
}

const mapStateToProps = state => {
  const { rectangles } = state;
  return {
    rectangles,
  };
};

export default connect(mapStateToProps)(Map);
