import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";

class Day extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {

  }

  onFocus() {
    this.setState({editing: true});
    this.props.focusDay(this.props.day);
  }

  onBlur() {
    this.setState({editing: false});
    this.props.focusDay(null);
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
            // "bold": this.state.editing,
          })}
          defaultValue=""
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          autoFocus={isToday}
        />
      </div>
    );
  }
}

export default Day;
