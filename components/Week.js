import React, { PureComponent } from "react";
import moment from "moment";

import Day from "./Day";

export default class Week extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      aDayIsFocused: false,
    };
  }

  onFocus = day => {
    this.setState({ aDayIsFocused: true });
    this.props.focusDay(day);
  };

  onBlur = day => {
    this.setState({ aDayIsFocused: false });
  };

  render() {
    const days = this.props.lists
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      : [0, 1, 2, 3, 4, 5, 6];

    return (
      <div className="week" style={this.props.style}>
        <style jsx>
          {
            `
          .week {
            height: 100vh;
            display: flex;
            align-items: stretch;
            padding: .25rem;
            position: relative;
          }

          @media (min-width: 40rem) {
            .week {
              padding: .5rem;
            }
          }

          .weekStamp {
            position: absolute;
            font-size: 0.625rem;
            line-height: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            color: grey;
          }
          `
          }
        </style>

        <time className="weekStamp">
          {this.props.lists
            ? "Static lists"
            : <span>W{this.props.weekOf.format("WW / MMM YYYY")}</span>}
        </time>

        {days.map(day => (
          <Day
            key={day}
            day={moment(this.props.weekOf).add(day, "days")}
            uid={this.props.uid}
            focusDay={this.props.focusDay}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            aDayIsFocused={this.state.aDayIsFocused}
            isList={this.props.lists}
          />
        ))}
      </div>
    );
  }
}
