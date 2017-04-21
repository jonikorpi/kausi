import React, { PureComponent } from "react";
import moment from "moment";

import Day from "./Day";
import Navigation from "../components/Navigation";

export default class Week extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { focusedDay: this.props.lists ? "1" : undefined };
  }

  onFocus = day => {
    if (this.props.lists) {
      this.setState({ focusedDay: day.format("D") });
    } else {
      this.props.focusDay(day);
    }
  };

  render() {
    const days = this.props.lists
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      : [0, 1, 2, 3, 4, 5, 6];

    const focusedDay =
      (this.props.url.query && Object.keys(this.props.query)[0]) ||
      this.state.focusedDay;

    return (
      <div className="week padding" style={this.props.style} role="row">
        <style jsx>
          {`
          .week {
            height: 91vh;
            display: flex;
            align-items: stretch;
            position: relative;
            overflow: hidden;
            padding-bottom: 1rem;
          }

          .weekStamp {
            position: absolute;
            font-size: 0.625rem;
            line-height: 0.625rem;
            text-transform: uppercase;
          }
          `}
        </style>

        <Navigation
          url={this.props.url}
          uid={this.props.uid}
          anonymous={this.props.anonymous}
          replaceActiveLinkWith={
            !this.props.lists &&
              <button
                onClick={this.props.scrollToToday}
                className="active"
                key="today"
                tabIndex="-1"
              >
                Timeline
              </button>
          }
        />

        <h1 className="weekStamp">
          {this.props.lists
            ? "Static lists"
            : <span>W{this.props.weekOf.format("WW MMM YYYY")}</span>}
        </h1>

        {days.map(day => {
          const dayValue = moment(this.props.weekOf).add(day, "days");
          const isToday = dayValue.isSame(moment().startOf("day"));

          return (
            <Day
              key={day}
              day={dayValue}
              uid={this.props.uid}
              focusDay={this.props.focusDay}
              onFocus={this.onFocus}
              focused={
                this.props.lists
                  ? focusedDay === dayValue.format("D")
                  : focusedDay === dayValue.format("YYYY-MM-DD") ||
                      (!focusedDay && isToday)
              }
              isToday={isToday}
              isList={this.props.lists}
            />
          );
        })}
      </div>
    );
  }
}
