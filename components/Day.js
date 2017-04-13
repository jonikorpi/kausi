import React, { PureComponent } from "react";
import moment from "moment";
import debounce from "lodash.debounce";
import classNames from "classnames";

import FirebaseProvider from "./FirebaseProvider";

export default class Day extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  onFocus = () => {
    this.setState({ focused: true });
    this.props.onFocus();
  };

  onBlur = () => {
    this.setState({ focused: false });
    this.props.onBlur();
  };

  render() {
    const isToday = this.props.day.isSame(moment().startOf("day"));
    const isWeekend = !this.props.someday &&
      (this.props.day.day() === 0 || this.props.day.day() === 6);
    const isFocused = this.state.focused ||
      (!this.props.aDayIsFocused && isToday);

    const dayNumber = this.props.day.format("DD");
    const weekday = this.props.day.format("dddd");

    // Additional entries
    let additionalTexts;

    if (this.props.textCount > 1) {
      let pluralConflictingEntries = `is a conflicting entry`;
      let next;

      if (this.props.textCount > 2) {
        pluralConflictingEntries = `are ${this.props.textCount} conflicting entries`;
        next = "next ";
      }

      additionalTexts = (
        <div
          className="color-bright-6 size-0-75 padding-0-75 padding-top-0 margin-0-5 margin-y margin-bottom-0"
        >
          Problem: there
          {" "}
          {pluralConflictingEntries}
          {" "}
          for this day. If you remove this ↑ entry, the
          {" "}
          {next}
          conflicting entry should appear and you can decide what to do with it. This sometimes happens with an unstable connection. Sorry for the hassle. :﻿(
        </div>
      );
    }

    // Date label
    let label, dayLabel, monthLabel;

    if (!this.props.someday) {
      dayLabel = this.props.day.format("ddd DD");
      const todayLabel = isToday ? ", Today" : false;

      if (
        this.props.day.isSame(moment(this.props.day).startOf("isoweek")) ||
        this.props.day.isSame(moment(this.props.day).startOf("month"))
      ) {
        monthLabel = `, ${this.props.day.format("MMM YYYY")}`;
      }

      label = (
        <label
          className={classNames({
            "all-caps padding-0-75 padding-x color-4": true,
            "color-bright-4": isWeekend,
            "color-bright-5": isToday,
          })}
          style={{
            paddingTop: "0.5rem",
          }}
          htmlFor={this.props.day.valueOf()}
        >
          {dayLabel}{monthLabel}{todayLabel}
        </label>
      );
    }

    return (
      <div
        className={classNames({
          day: true,
          focused: isFocused,
          today: isToday,
        })}
      >
        <style jsx>
          {
            `
          .day {
            flex-grow: 1;
            width: 0;
            margin-top: 1rem;
            position: relative;
            color: #999;
            background-color: #222;
          }

          .day:first-of-type {
            border-radius: 0.25rem 0 0 0.25rem;
          }

          .day:last-child,
          .day:last-child .editors {
            border-radius: 0 0.25rem 0.25rem 0;
          }

          .focused {
            flex: none;
            color: inherit;
          }

          .focused {
            width: 18rem;
            max-width: 66.666vw;
          }

          .label {
            position: absolute;
            left: 0; top: -1rem;
            font-size: 0.5rem;
            white-space: nowrap;
            text-transform: uppercase;
          }

          .editors {
            position: absolute;
            left: 0; top: -1px; right: 0; bottom: -1px;
            display: flex;
            flex-direction: column;
            background-color: inherit;
            border: solid black;
            border-width: 1px 0 1px 1px;
            border-radius: 0.25rem 0 0 0.25rem;
          }
        `
          }
        </style>

        <label className="label" htmlFor={this.props.day.valueOf()}>
          <time className="dateStamp">
            {this.props.day.format(
              this.props.isList ? "D" : isFocused ? "DD ddd" : "DD"
            )}
          </time>
          {isToday && isFocused && " / today"}
        </label>

        <div className="editors">
          <FirebaseProvider
            uid={this.props.uid}
            day={this.props.day}
            focused={this.state.focused}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            placeholder={
              isFocused && !this.props.isList ? "This day" : undefined
            }
          />

          {!this.props.isList &&
            <FirebaseProvider
              uid={this.props.uid}
              day={weekday}
              focused={this.state.focused}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              placeholder={
                isFocused ? "Every " + this.props.day.format("dddd") : undefined
              }
              autoSize
            />}

          {!this.props.isList &&
            dayNumber < 29 &&
            <FirebaseProvider
              uid={this.props.uid}
              day={dayNumber}
              focused={this.state.focused}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              placeholder={
                isFocused ? "Every " + this.props.day.format("Do") : undefined
              }
              autoSize
            />}
        </div>
      </div>
    );
  }
}
