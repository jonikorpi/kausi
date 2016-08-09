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

  onBlur(event) {
    this.setState({
      editing: false
    });
    this.props.focusDay(null);
    this.saveTodo();
  }

  onChange(event) {
    const value = event.target.value;
    this.setState({text: value})
    this.saveTodoHandler();
  }

  render() {
    const isToday = this.props.day.valueOf() === this.props.today.valueOf();

    const dayClasses = classNames({
      "day flex vertical padding-0-5 padding-top overflow-hidden": true,
      ["bg-" + this.props.colorNumber]: true,
      ["color-" + (this.props.colorNumber+2)]: true,
      ["color-bright-4"]:
        this.props.day.isoWeekday() === 7 ||
        this.props.day.isoWeekday() === 6
      ,
      "focused-day color-bright-5": this.props.isFocusedDay,
      "focused-weekday": this.props.isFocusedWeekDay,
      "unfocused-day": this.props.aDayIsFocused && !this.props.isFocusedDay,
    });

    let monthLabel, todayLabel;

    if (isToday) {
      todayLabel = "Today";
    }

    if (
        (this.props.isFirstWeek && this.props.day.isSame(moment(this.props.day).startOf("isoweek"))) ||
        this.props.day.isSame(moment(this.props.day).startOf("month"))
    ) {
      monthLabel = this.props.day.format("MMM");
    }

    return (
      <div className={dayClasses}>
        <h1
          className={classNames({
            "padding-0-5 padding-x": true,
            "all-caps": true,
          })}
        >
          {this.props.day.format("DD")} {monthLabel} {todayLabel}
        </h1>

        <textarea
          className={classNames({
            "padding-0-5 grow width-100": true,
            "nowrap": !this.state.editing,
          })}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          autoFocus={isToday}
          value={this.state.text}
        />
      </div>
    );
  }
}

export default Day;
