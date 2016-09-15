import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";
import ReactList from 'react-list';

import Day from "./Day";

class Timeline extends Component {
  constructor(props) {
    super(props);
    //
    //
    // this.focusDay = this.focusDay.bind(this);
    // this.unfocusDay = this.unfocusDay.bind(this);
    // this.scrollTo = this.scrollTo.bind(this);

    this.timelineLength = 4096;
    this.somedayLength = 10;

    this.state = {
      visibleRange: [0, 0]
      // focusedDay: null,
      // requestedScroll: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.targetDay !== this.props.targetDay) {
  //     this.setState({focusedDay: null});
  //   }
  // }
  //
  // focusDay(day, textarea) {
  //   this.setState({focusedDay: day});
  //   this.scrollTo(textarea);
  // }
  //
  // unfocusDay(day) {
  //   this.setState({focusedDay: null});
  // }
  //
  // scrollTo(element) {
  //   if (this.weekScroller) {
  //     const target = element.getBoundingClientRect();
  //     const windowWidth = window.innerWidth;
  //     const pixels = target.left - (windowWidth * 0.5) + (target.width * 0.5);
  //     this.weekScroller.scrollLeft += pixels;
  //   }
  // }

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
    // let weeks, startAt, endAt, alsoStartAt, alsoEndAt;
    // const firstOfThisWeek = moment(this.props.targetDay).startOf("isoweek");
    // // const firstOfLastWeek = moment(firstOfThisWeek).subtract(7, "days");
    // const firstOfNextWeek = moment(firstOfThisWeek).add(7, "days");
    //
    // startAt = moment(firstOfThisWeek)/*.subtract(7, "days")*/.valueOf();
    // endAt = moment(firstOfThisWeek).add(15, "days").valueOf();
    //
    // alsoStartAt = 0;
    // alsoEndAt = moment(0).add(7, "days").valueOf();
    //
    // let somedays = {days: [], somedays: true}
    // // let lastWeek = {days: []};
    // let thisWeek = {days: []};
    // let nextWeek = {days: []};
    //
    // for (let i = 0; i < 7; i++) {
    //   somedays.days.push(moment(0).add(i, "days"));
    // }
    //
    // // for (let i = 0; i < 7; i++) {
    // //   lastWeek.days.push(moment(firstOfLastWeek).add(i, "days"));
    // // }
    //
    // for (let i = 0; i < 7; i++) {
    //   thisWeek.days.push(moment(firstOfThisWeek).add(i, "days"));
    // }
    //
    // for (let i = 0; i < 7; i++) {
    //   nextWeek.days.push(moment(firstOfNextWeek).add(i, "days"));
    // }
    //
    // weeks = [/*lastWeek,*/ thisWeek, nextWeek, somedays];
    //
    // return (
    //   <div
    //     ref={(c) => this.weekScroller = c}
    //     className={classNames({
    //       "week-scroller grow flex overflow-auto": true,
    //     })}
    //   >
    //     <WeekContainer
    //       weeks={weeks}
    //       startAt={startAt}
    //       endAt={endAt}
    //       alsoStartAt={alsoStartAt}
    //       alsoEndAt={alsoEndAt}
    //       firebaseRef={this.props.firebaseRef}
    //       today={this.props.today}
    //       targetDay={this.props.targetDay}
    //       focusedDay={this.state.focusedDay}
    //       saveTodo={this.props.saveTodo}
    //       focusDay={this.focusDay}
    //       unfocusDay={this.unfocusDay}
    //       scrollTo={this.scrollTo}
    //       connected={this.props.connected}
    //       haveConnectedOnce={this.props.haveConnectedOnce}
    //       anonymous={this.props.anonymous}
    //     />
    //   </div>
    // );

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
