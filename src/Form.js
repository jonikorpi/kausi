import React, { Component } from "react";
import classNames from "classnames";

import Button from "./Button";

class Form extends Component {
  constructor(props) {
    super(props);

    let fields = {};
    this.props.fields.forEach(function(field) {
      fields[field.id] = {
        id: field.id,
        type: field.type,
        label: field.label,
        value: null,
        focused: false,
      };
    });

    this.state = {
      fields: fields,
    }

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {

  }

  onFocus(event) {
    let tempState = this.state.fields;
    tempState[event.target.id].focused = true;
    if (event.target.id) {
      this.setState({
        fields: tempState,
      });
    }
  }

  onBlur(event) {
    let tempState = this.state.fields;
    tempState[event.target.id].focused = false;
    if (event.target.id) {
      this.setState({
        fields: tempState,
      });
    }
  }

  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    let tempState = this.state.fields;
    Object.keys(tempState).forEach(function(field) {
      tempState[field].value = this[field].value;
    }.bind(this));
    this.setState({
      fields: tempState,
    });
    this.props.onSubmit(this.state.fields);
  }

  render() {
    let fields = Object.keys(this.state.fields).map(function(id){
      const field = this.state.fields[id];
      return (
        <div
          key={id}
          className={classNames({
            "flex vertical": true,
            "bg-2": !field.focused,
            "bg-3": field.focused,
          })}
        >
          <label
            className="all-caps padding-0-5 padding-bottom-0"
            htmlFor={id}
          >
            {field.label}
          </label>
          <input
            ref={(c) => this[id] = c}
            className="padding-0-5 size-1-25"
            id={field.id}
            type={field.type}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </div>
      );
    }.bind(this));

    return (
      <form
        onSubmit={this.onSubmit}
        className="narrow-max-width child-margins-y-1 flex vertical align-center"
      >
        <div className="child-margins-y-hairline">
          {fields}
        </div>
        <Button type="submit" className="size-1-25 rounded" label={this.props.buttonLabel}/>
      </form>
    );
  }
}

export default Form;
