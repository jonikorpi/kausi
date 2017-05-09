import React, { PureComponent } from "react";

import Week from "./Week";

export default class WeekContainer extends PureComponent {
  render() {
    return (
      <div className="weekContainer" style={this.props.style}>
        <Week
          index={this.props.index}
          weekOf={this.props.weekOf}
          url={this.props.url}
          query={this.props.query}
          anonymous={this.props.anonymous}
          uid={this.props.uid}
          focusDay={this.props.focusDay}
          scrollToToday={this.props.scrollToToday}
        />
      </div>
    );
  }
}
