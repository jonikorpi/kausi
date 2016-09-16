import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";
import ReactList from 'react-list';
import debounce from "lodash.debounce";

import Controls from "./Controls";
import Button from "./Button";
import DayContainer from "./DayContainer";

class Timeline extends Component {
  constructor(props) {
    super(props);

    const timelineLength = 4096;
    this.timelineLength = timelineLength;
    this.somedayLength = 10;

    this.state = {
      lastActiveTimelineIndex: timelineLength / 2,
      lastActiveSomedayIndex: 0,
      activeTimeline: "timeline",
    };

    this.handleResizeHandler = debounce(function () {
      this.handleResize(this.state.lastActiveTimelineIndex, this.state.lastActiveSomedayIndex)
    }, 100);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResizeHandler.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeHandler.bind(this));
  }

  handleResize(timelineIndex, somedayIndex) {
    this.timeline.scrollTo(timelineIndex);
    this.someday.scrollTo(somedayIndex);
  }

  scrollToToday(timelineIndex, somedayIndex) {
    this.timeline.scrollTo(this.timelineLength / 2);
    this.setTimelineAsActive(this.timelineLength / 2);
  }

  setTimelineAsActive(index) {
    this.setState({
      activeTimeline: "timeline",
      lastActiveTimelineIndex: index,
    });
  }

  setSomedayAsActive(index) {
    this.setState({
      activeTimeline: "someday",
      lastActiveSomedayIndex: index,
    });
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
      <DayContainer
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
      <DayContainer
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
    let timeline, someday, spinner;

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
    else {
      spinner = (
        <div className="width-100 flex justify-center align-center enter-zoom">
          <div className="spin border border-0-125 dashed round height-1-5 width-1-5"></div>
        </div>
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
          <Button label="Today" onClick={this.scrollToToday.bind(this)}/>
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
        >
          {spinner}
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
