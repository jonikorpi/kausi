import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import { debounce } from 'lodash/function';

class Day extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      text: "",
    };

    this.saveTodo = this.saveTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.saveTodoHandler = debounce(function () {
      this.saveTodo()
    }, 500);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      text: nextProps.text
    });
  }

  saveTodo() {
    this.props.saveTodo(this.props.firebaseKey, this.props.day.valueOf(), this.state.text);
  }

  onFocus() {
    this.setState({editing: true});
    this.props.focusDay(this.props.day);
  }

  onBlur() {
    this.setState({
      editing: false
    });
    this.props.focusDay(null);
    this.saveTodo();
  }

  onChange(event) {
    this.setState({text: event.target.value})
    this.saveTodoHandler();
  }

  onKeyDown(event) {
    if (event.keyCode === 27 /*esc*/) {
      this.textarea.blur();
    }
  }

  render() {
    const dayClasses = classNames({
      "day faint-bottom-border flex vertical padding-0-5 padding-top overflow-hidden min-day-width": true,
      ["bg-" + this.props.colorNumber]: true,
      "": !this.props.isFocusedDay,
      // ["focused-day color-" + (this.props.colorNumber+3)]: this.props.isFocusedDay,
      "focused-weekday": this.props.isFocusedWeekDay,
      ["color-" + (this.props.colorNumber+3)]: !this.props.aDayIsFocused || this.props.isFocusedDay,
      ["unfocused-day color-" + (this.props.colorNumber+2)]: this.props.aDayIsFocused && !this.props.isFocusedDay,
    });

    let dayLabel, monthLabel;
    const todayLabel = this.props.isToday? ", Today" : false

    if (this.props.someday) {
      dayLabel = `Someday ${this.props.day.format("D")}`
    }
    else {
      dayLabel = this.props.day.format("ddd DD");

      if (
          (
            this.props.isFirstWeek &&
            this.props.day.isSame(moment(this.props.day).startOf("isoweek"))
          ) ||
          this.props.day.isSame(moment(this.props.day).startOf("month"))
      ) {
        monthLabel = `, ${this.props.day.format("MMM YYYY")}`;
      }
    }

    return (
      <div className={dayClasses}>
        <label
          htmlFor={this.props.day.valueOf()}
          className={classNames({
            "padding-0-25 padding-x": true,
            // ["color-" + (this.props.colorNumber+2)]: true,
            "all-caps": true,
            "color-bright-6": this.props.isTargetDay && (!this.props.aDayIsFocused || this.props.isFocusedDay),
            "color-bright-4": this.props.isTargetDay && this.props.aDayIsFocused && !this.props.isFocusedDay,
            // "color-bright-4":
            //   this.props.day.isoWeekday() === 7 ||
            //   this.props.day.isoWeekday() === 6
            // ,
          })}
        >
          {dayLabel}{monthLabel}{todayLabel}
        </label>

        <textarea
          id={this.props.day.valueOf()}
          ref={(c) => this.textarea = c}
          className={classNames({
            "padding-0-25 grow width-100": true,
            // "nowrap": !this.state.editing,
          })}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          value={this.state.text}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}

export default Day;
