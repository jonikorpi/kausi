import React, { Component } from "react";
import Perf from "react-addons-perf";
Perf.start();
window.Perf = Perf;

import Connection from "./Connection";

class Development extends Component {
  render() {
    return (
      <Connection/>
    );
  }
}

export default Development;
