import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";
import ReactList from 'react-list';

import Day from "./Day";

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.timelineLength = 4096;
    this.somedayLength = 10;

    this.state = {
      visibleRange: [0, 0]
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onScroll() {
    this.setState({visibleRange: this.timeline.getVisibleRange()});
  }

  timelineDayRenderer(index, key) {
    const todayIndex = Math.round((this.timelineLength / 2));
    let day = moment().startOf("day");

    if (index < todayIndex) {
      day.subtract(todayIndex - index, "days");
    }
    else if (index > todayIndex) {
      day.add(index - todayIndex, "days");
    }

    return (
      <Day
        key={index}
        index={index}
        day={day}
        uid={this.props.uid}
        anonymous={this.props.anonymous}
        haveConnectedOnce={this.props.haveConnectedOnce}
      />
    );
  }

  somedayDayRenderer(index, key) {
    let day = moment(0).add(index, "days");

    return (
      <Day
        key={index}
        index={index}
        day={day}
        uid={this.props.uid}
        anonymous={this.props.anonymous}
        haveConnectedOnce={this.props.haveConnectedOnce}
        someday={true}
      />
    );
  }

  timelineRenderer(items, ref) {
    return (
      <div
        className="flex"
        ref={ref}
      >
        {items}
      </div>
    );
  }

  render() {
    return (
      <div className="grow flex vertical">

        <div
          className="timeline overflow-auto grow grow-children flex vertical"
          onScroll={this.onScroll.bind(this)}
        >
          <ReactList
            ref={c => this.timeline = c}
            axis="x"
            itemRenderer={this.timelineDayRenderer.bind(this)}
            itemsRenderer={this.timelineRenderer.bind(this)}
            length={this.timelineLength}
            type="uniform"
            pageSize={7}
            initialIndex={this.timelineLength / 2}
            threshold={window.outerWidth}
          />
        </div>

        <div
          className="timeline overflow-auto grow grow-children flex vertical bg-2"
        >
          <ReactList
            ref={c => this.someday = c}
            axis="x"
            itemRenderer={this.somedayDayRenderer.bind(this)}
            itemsRenderer={this.timelineRenderer.bind(this)}
            length={this.somedayLength}
            type="uniform"
            pageSize={this.somedayLength}
          />
        </div>

      </div>
    );
  }
}

export default Timeline;
