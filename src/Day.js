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
      "flex vertical padding-0-5 padding-top": true,
      ["color-" + this.props.colorNumber]: true,
      ["color-bright-" + this.props.colorNumber]:
        this.props.day.isoWeekday() === 7 ||
        this.props.day.isoWeekday() === 6
      ,
      "focused-day": this.props.isFocusedDay,
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
            "padding-0-5 padding-x size-1-25": true,
            "all-caps": true,
          })}
        >
          {this.props.day.format("DD")} {monthLabel} {todayLabel}
        </h1>

        <textarea
          className={classNames({
            "day padding-0-5 grow width-100": true,
            // "bold": this.state.editing,
          })}
          defaultValue=""
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}

export default Day;
