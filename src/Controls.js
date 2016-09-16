import React, { Component } from 'react';
import shallowCompare from "react-addons-shallow-compare";

class Controls extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div
        id="controls"
        className={"flex child-margins-x-0-25 " + this.props.className}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Controls;
