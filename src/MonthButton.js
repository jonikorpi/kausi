import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";

class MonthButton extends Component {
  constructor(props) {
    super(props);

    this.goToDay = this.goToDay.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  goToDay() {
    this.props.goToDay(this.props.day);
  }

  render() {
    let month, year, textMarker;

    if (this.props.text) {
      let lines = [];
      for (let i = 0; i < (this.props.text.length/30); i++) {
        lines.push(i);
      }

      textMarker = (
        <div className="child-margins-y-0-25 margin-0-25 margin-top enter-fade">
          {lines.map(function(i) {
            const randomWidth = i+1 === lines.length ? Math.floor(Math.random()*(76-38+1)+38) : Math.floor(Math.random()*(100-85+1)+85);

            return (
              <div
                key={i}
                style={{width: `${randomWidth}%`}}
                className={classNames({
                  "border-top": true,
                })}
              />
            );
          })}
        </div>
      );
    }

    if (moment(this.props.day).startOf("month").isSame(this.props.day)) {
      month = this.props.day.format("MMM");
      year = this.props.day.format("YYYY");
    }

    return (
      <button
        key={this.props.day.valueOf()}
        className={classNames({
          "button size-0-75 flex vertical text-align-left padding-0-5 all-caps overflow-hidden": true,
          "color-bright-6": this.props.day.isSame(this.props.today),
        })}
        onClick={this.goToDay}
      >
        <div className="no-events">
          {this.props.day.format("DD")} {month} {year}
          {textMarker}
        </div>
      </button>
    );
  }
}

export default MonthButton;
