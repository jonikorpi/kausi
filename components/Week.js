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

  onFocus = () => {
    this.setState({ aDayIsFocused: true });
  };

  onBlur = () => {
    this.setState({ aDayIsFocused: false });
  };

  render() {
    const days = [0, 1, 2, 3, 4, 5, 6];

    return (
      <div className="week" style={this.props.style}>
        <style jsx>
          {
            `
          .week {
            height: 91vh;
            display: flex;
            align-items: stretch;
            padding: 1.5rem 0.25rem 0;
          }

          .weekStamp {
            position: absolute;
            top: 0;
          }
          `
          }
        </style>

        <time className="weekStamp">
          W{this.props.weekOf.format("WW MMM YYYY")}
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
          />
        ))}
      </div>
    );
  }
}
