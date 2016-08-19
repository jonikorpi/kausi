import React, { Component } from "react";
import classNames from "classnames";

import Button from "./Button";

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: this.getFields(this.props.fields),
    }

    this.getFields = this.getFields.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fields !== this.state.fields) {
      this.setState({fields: this.getFields(nextProps.fields)})
    }
  }

  getFields(propFields) {
    let fields = {};
    propFields.forEach(function(field) {
      fields[field.id] = {
        id: field.id,
        type: field.type,
        label: field.label,
        value: null,
        focused: false,
      };
    });
    return fields;
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
    const colorNumber = this.props.colorNumber || 0;

    let fields = Object.keys(this.state.fields).map(function(id){
      const field = this.state.fields[id];
      return (
        <div
          key={id}
          className={classNames({
            "flex vertical grow color-6": true,
            [`bg-${2 + colorNumber}`]: !field.focused,
            [`bg-${3 + colorNumber}`]: field.focused,
          })}
        >
          <label
            className="all-caps size-0-75 padding-0-5 padding-bottom-0"
            htmlFor={id}
          >
            {field.label}
          </label>
          <input
            ref={(c) => this[id] = c}
            className="padding-0-5 size-1 width-100"
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
        className="child-margins-y-1 flex vertical align-center width-100"
      >
        <div className="child-margins-x-hairline flex wide-max-width width-100">
          {fields}
        </div>
        <Button type="submit" className="rounded" label={this.props.buttonLabel}/>
      </form>
    );
  }
}

export default Form;
