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
      visibleRange: [0, 0],
      activeTimeline: "timeline",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onScroll() {
    this.setState({visibleRange: this.timeline.getVisibleRange()});
  }

  setTimelineAsActive() {
    this.setState({activeTimeline: "timeline"});
  }

  setSomedayAsActive() {
    this.setState({activeTimeline: "someday"});
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
        setActiveTimeline={this.setTimelineAsActive.bind(this)}
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
        setActiveTimeline={this.setSomedayAsActive.bind(this)}
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
          className={classNames({
            "timeline overflow-auto grow grow-children flex vertical": true,
            "active-timeline": this.state.activeTimeline === "timeline"
          })}
          // onScroll={this.onScroll.bind(this)}
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
            threshold={window.innerWidth*2}
          />
        </div>

        <div
          className={classNames({
            "timeline overflow-auto grow grow-children flex vertical bg-2": true,
            "active-timeline": this.state.activeTimeline === "someday"
          })}
        >
          <ReactList
            ref={c => this.someday = c}
            axis="x"
            itemRenderer={this.somedayDayRenderer.bind(this)}
            itemsRenderer={this.timelineRenderer.bind(this)}
            length={this.somedayLength}
            type="uniform"
            pageSize={this.somedayLength}
            threshold={window.innerWidth*2}
          />
        </div>

      </div>
    );
  }
}

export default Timeline;
