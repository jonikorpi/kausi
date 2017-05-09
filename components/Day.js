import React, { PureComponent } from "react";
import moment from "moment";
import classNames from "classnames";

import FirebaseProvider from "./FirebaseProvider";

const getToday = () => {
  return moment().startOf("day");
};

export default class Day extends PureComponent {
  onFocus = () => {
    this.props.onFocus(this.props.day);
  };

  render() {
    const isToday = this.props.day.isSame(getToday());
    const isWeekend =
      !this.props.someday &&
      (this.props.day.day() === 0 || this.props.day.day() === 6);
    const isFocused = this.props.focused;

    const dayNumber = this.props.day.format("D");
    const weekday = this.props.day.format("dddd");

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
        role="gridcell"
      >
        <style jsx>
          {`
          .day {
            flex-grow: 1;
            width: 0;
            margin-top: 2rem;
            position: relative;
          }

          .day:first-of-type {
            border-radius: 0.25rem 0 0 0.25rem;
          }

          .day:last-child,
          .day:last-child .editors {
            border-radius: 0.25rem;
          }

          .focused {
            flex: none;
            color: hsl(0, 0%, 91%);
            z-index: 1;
          }

          .focused,
          .editors {
            width: 24rem;
            max-width: 70vw;
          }

          .label {
            position: absolute;
            left: 0; bottom: 100%;
            font-size: 0.5rem;
            line-height: 1.25rem;
            white-space: nowrap;
            text-transform: uppercase;
          }

          @media (min-width: 30rem) {
            .label {
              font-size: 0.625rem;
            }
          }

          .editors {
            position: absolute;
            left: 0; top: -1px; right: 1px; bottom: -1px;
            display: flex;
            flex-direction: column;
            background-color: #000;
            border: 1px solid;
            border-radius: 0.25rem;
            box-shadow:
              -1px 0 0 black,
              1px 0 0 black
            ;
          }
        `}
        </style>

        <h2 className="label" htmlFor={this.props.day.valueOf()}>
          <time className="dateStamp">
            {this.props.day.format(
              this.props.isList ? "D" : isFocused ? "DD MMM / ddd" : "DD"
            )}
          </time>
          {isToday && isFocused && " (today)"}
        </h2>

        <div className="editors">
          <FirebaseProvider
            first={true}
            uid={this.props.uid}
            day={this.props.day}
            focused={isFocused}
            onFocus={this.onFocus}
            label={
              this.props.isList
                ? `List ${this.props.day.format("D")}`
                : this.props.day.format("DD MMM / ddd")
            }
          />

          {!this.props.isList &&
            <FirebaseProvider
              uid={this.props.uid}
              day={weekday}
              focused={isFocused}
              onFocus={this.onFocus}
              label={this.props.day.format("dddd") + "s"}
              autoSize
            />}

          {!this.props.isList &&
            dayNumber < 29 &&
            <FirebaseProvider
              last={true}
              uid={this.props.uid}
              day={dayNumber}
              focused={isFocused}
              onFocus={this.onFocus}
              label={this.props.day.format("Do")}
              autoSize
            />}
        </div>
      </div>
    );
  }
}
