import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";
import ReactList from 'react-list';
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";

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
      today: moment().startOf("day"),
      lastActiveTimelineIndex: timelineLength / 2,
      firstVisibleIndex: timelineLength / 2,
      lastActiveSomedayIndex: 0,
      activeTimeline: "timeline",
      haveScrolledRecently: false,
      recentScrollDirection: "left",
      updateTodayHandler: null,
    };

    this.getDayFromIndex = this.getDayFromIndex.bind(this);
    this.removeRecentScroll = this.removeRecentScroll.bind(this);
    this.updateToday = this.updateToday.bind(this);

    this.onResizeHandler = debounce(function () {
      this.onResize(this.state.lastActiveTimelineIndex, this.state.lastActiveSomedayIndex)
    }, 100);

    this.removeRecentScrollHandler = debounce(function () {
      this.removeRecentScroll()
    }, 500);

    this.onScrollHandler = throttle(function () {
      this.onScroll()
    }, 50, { leading: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResizeHandler.bind(this));

    const updateTodayHandler = setInterval(this.updateToday, 1000 * 10);
    this.setState({ updateTodayHandler: updateTodayHandler });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResizeHandler.bind(this));

    clearInterval(this.state.updateTodayHandler);
  }

  updateToday() {
    const newToday = moment().startOf("day");

    if (!this.state.today.isSame(newToday)) {
      console.log("Reloading because date has changed");
      window.location.reload();
    }
  }

  onResize(timelineIndex, somedayIndex) {
    if (this.timeline || this.someday) {
      this.timeline.scrollTo(timelineIndex);
      this.someday.scrollTo(somedayIndex);
    }
  }

  removeRecentScroll() {
    this.setState({ haveScrolledRecently: false });
  }

  onScroll() {
    const firstVisibleIndex = this.timeline.getVisibleRange()[0];
    const lastVisibleIndex = this.timeline.getVisibleRange()[1];
    const recentScrollDirection = firstVisibleIndex >= this.state.firstVisibleIndex ? "right" : "left";

    if (firstVisibleIndex && firstVisibleIndex !== this.state.firstVisibleIndex) {
      this.setState({
        firstVisibleIndex: firstVisibleIndex,
        lastVisibleIndex: lastVisibleIndex,
        haveScrolledRecently: true,
        recentScrollDirection: recentScrollDirection,
      });
    }

    this.removeRecentScrollHandler();
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

  getDayFromIndex(index) {
    const todayIndex = Math.round((this.timelineLength / 2));
    let day = moment(this.state.today);

    if (index < todayIndex) {
      day.subtract(todayIndex - index, "days");
    }
    else if (index > todayIndex) {
      day.add(index - todayIndex, "days");
    }

    return day;
  }

  timelineDayRenderer(index, key) {
    const day = this.getDayFromIndex(index);

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
          threshold={window.innerWidth * 2}
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
          threshold={window.innerWidth * 2}
        />
      );
    }
    else {
      spinner = (
        <div className="width-100 flex justify-center align-center">
          <div className="spin border border-0-125 dashed round height-1-5 width-1-5"></div>
        </div>
      );
    }

    let accountButton;

    if (this.props.anonymous) {
      accountButton = (
        <Button
          label="Sign up/in"
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

    let controls, dateSticker;

    if (this.props.haveConnectedOnce) {
      controls = (
        <Controls
          className="absolute padding-0-75 padding-x padding-left-0"
          style={{
            right: 0,
            transform: `translateY(-50%)`,
            zIndex: 2,
          }}
        >
          <Button label="Today" onClick={this.scrollToToday.bind(this)} />
          {accountButton}
        </Controls>
      );

      const visibleIndexToShow = this.state.recentScrollDirection === "left" ? this.state.firstVisibleIndex : this.state.lastVisibleIndex;

      dateSticker = (
        <div
          className={classNames({
            "all-caps size-1 padding-0-75 font-mono color-bright-6 enter-zoom no-events": true,
            "position-top-left": this.state.recentScrollDirection === "left",
            "position-top-right": this.state.recentScrollDirection === "right",
          })}
          style={{
            zIndex: 2,
            opacity: this.state.haveScrolledRecently ? 1 : 0,
            transition: "opacity ease-in-out",
            transitionDuration: this.state.haveScrolledRecently ? "414ms" : "256ms",
            textShadow: `
              -0.0625rem -0.0625rem 0 #251916,
               0.0625rem  0.0625rem 0 #251916,
              -0.0625rem  0.0625rem 0 #251916,
               0.0625rem -0.0625rem 0 #251916
            `,
          }}
        >
          {this.getDayFromIndex(visibleIndexToShow).format("DD MMM YYYY")}
        </div>
      );
    }

    return (
      <div className="grow flex vertical">

        <div
          className={classNames({
            "timeline relative overflow-auto grow grow-children flex vertical": true,
            "active-timeline": this.state.activeTimeline === "timeline"
          })}
          onScroll={this.onScrollHandler.bind(this)}
        >
          {spinner}
          {timeline}
        </div>

        <div>
          {dateSticker}
          {controls}
        </div>

        <div
          className={classNames({
            "timeline overflow-auto grow grow-children flex vertical bg-2": true,
            "active-timeline": this.state.activeTimeline === "someday"
          })}
        >
          {someday}
        </div>
      </div>
    );
  }
}

export default Timeline;
