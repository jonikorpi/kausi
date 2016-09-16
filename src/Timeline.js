import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";
import ReactList from 'react-list';

import Controls from "./Controls";
import Button from "./Button";
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
    let timeline, someday;

    if (this.props.haveConnectedOnce) {
      timeline = (
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
      );

      someday = (
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
      );
    }

    const controlsPosition = this.state.activeTimeline === "timeline" ? 76.4 : 23.6;

    let accountButton;

    if (this.props.anonymous) {
      accountButton = (
        <Button
          label="Sign in/up"
          onClick={this.props.goToSignInUp}
        />
      );
    }
    else {
      accountButton = (
        <Button
          label="Account"
          onClick={this.props.goToAccount}
        />
      );
    }

    let controls;

    if (this.props.haveConnectedOnce) {
      controls = (
        <Controls
          className="position-top-right padding-0-75 padding-x padding-left-0"
          style={{
            transform: `translateY(-50%) translateY(${controlsPosition}vh)`,
            transition: "transform 141ms ease-out",
          }}
        >
          {accountButton}
        </Controls>
      );
    }

    return (
      <div className="grow flex vertical">

        <div
          className={classNames({
            "timeline relative overflow-auto grow grow-children flex vertical": true,
            "active-timeline": this.state.activeTimeline === "timeline"
          })}
          // onScroll={this.onScroll.bind(this)}
        >
          {timeline}
        </div>

        <div
          className={classNames({
            "timeline overflow-auto grow grow-children flex vertical bg-2": true,
            "active-timeline": this.state.activeTimeline === "someday"
          })}
        >
          {someday}
        </div>

        {controls}
      </div>
    );
  }
}

export default Timeline;
