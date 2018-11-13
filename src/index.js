import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Map from './Map';

import './styles.css';

// require('leaflet');
// require('leaflet.pm');
// require('leaflet-geometryutil');
// require('leaflet-path-transform');

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Map />
      </Provider>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
