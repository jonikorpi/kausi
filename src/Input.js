import React, { Component } from "react";
import classNames from "classnames";

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      focused: false,
    }

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(event) {
    this.setState({value: event.target.value});
    this.props.onChange(this.state.value);
  }

  onFocus() {
    this.setState({focused: true});
  }

  onBlur() {
    this.setState({focused: false});
  }

  render() {
    return (
      <div
        className={classNames({
          "flex vertical enter-zoom": true,
          "bg-2": !this.state.focused,
          "bg-3": this.state.focused,
          [this.props.className]: this.props.className,
        })}
      >
        <label
          className="all-caps padding-0-5 padding-bottom-0"
          htmlFor={this.props.name}
        >
          {this.props.label}
        </label>
        <input
          className="padding-0-5 size-1-25"
          id={this.props.name}
          type={this.props.type}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}

export default Input;
