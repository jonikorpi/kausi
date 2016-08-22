import React, { Component } from "react";
import Perf from "react-addons-perf";

if (process.env.NODE_ENV === "development" && Perf) {
  Perf.start();
  window.Perf = Perf;
}

import Connection from "./Connection";

class App extends Component {
  render() {
    return (
      <Connection/>
    );
  }
}

export default App;
