import React, { Component } from "react";
import classNames from "classnames";

class Button extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    return (
      <button
        type={this.props.type || "button"}
        className={classNames({
          "button size-1 all-caps padding-0-5 enter-zoom text-align-center nowrap": true,
          "color-1 bg-7": this.props.disabled,
          [this.props.className]: this.props.className,
        })}
        onClick={this.clickHandler}
        disabled={this.props.disabled}
      >
        {this.props.label}
      </button>
    );
  }
}

export default Button;
