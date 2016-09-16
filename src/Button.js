import React, { Component } from "react";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";

class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  clickHandler() {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick();
    }
  }

  onFocus(event) {
    this.setState({isFocused: true});
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  onBlur(event) {
    this.setState({isFocused: false});
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  render() {
    return (
      <button
        type={this.props.type || "button"}
        className={classNames({
          "button size-0-75 color-1 border border-color-1 rounded-0-25 all-caps padding-0-25 enter-zoom text-align-center nowrap": true,
          [this.props.className]: this.props.className,
          "bg-5": !this.state.isFocused,
          "bg-6":  this.state.isFocused,
          "bg-bright-6":  this.props.disabled,
        })}
        disabled={this.props.disabled}
        onClick={this.clickHandler.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onMouseOver={this.onFocus.bind(this)}
        onMouseOut={this.onBlur.bind(this)}
      >
        {this.props.label}
      </button>
    );
  }
}

export default Button;
