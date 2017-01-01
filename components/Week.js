import React, { Component } from "react";
import moment from "moment";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import styled from "styled-components";

import Day from "./Day";

const WeekContainer = styled.div`
  display: flex;
  height: 100vh;
`;

class Week extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firebase: undefined,
    };
  }

  componentDidMount() {
    if (this.props.uid) {
      this.bindFirebase(this.props.uid, this.props.weekOf);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid || nextProps.weekOf.valueOf() !== this.props.weekOf.valueOf()) {
      if (this.firebaseRefs.firebase) {
        this.unbind("firebase");
      }
      if (nextProps.uid) {
        this.bindFirebase(nextProps.uid, nextProps.weekOf);
      }
    }
  }

  bindFirebase = (uid, weekOf) => {
    this.bindAsObject(
      firebase.database()
        .ref(uid)
        .orderByChild("date")
        .startAt(weekOf.valueOf())
        .endAt(moment(weekOf).endOf("week").valueOf()),
      "firebase",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({firebase: undefined})
      }.bind(this)
    );
  }

  // saveTodo = (text, lastUpdated, day, firebaseKey) => {
  //   if (this.props.uid && lastUpdated && day) {
  //     let firebaseRef = firebase.database().ref(this.props.uid);
  //
  //     if (!firebaseKey && text) {
  //       firebaseKey = firebaseRef.push().key;
  //     }
  //
  //     if (firebaseKey) {
  //       if (text) {
  //         firebaseRef.update({
  //           [firebaseKey]: {
  //             date: day.valueOf(),
  //             text: text,
  //             lastUpdated: lastUpdated,
  //           }
  //         });
  //       }
  //       else {
  //         firebaseRef.update({
  //           [firebaseKey]: null
  //         });
  //       }
  //     }
  //   }
  // }

  render() {
    // let firebaseValue, firebaseKey;
    // let firebaseKeys = [];
    // const firebaseState = this.state.firebase;
    //
    // if (firebaseState) {
    //   for (let key in firebaseState) {
    //     if (firebaseState.hasOwnProperty(key) && !key.startsWith(".")) {
    //       firebaseKeys.push(key);
    //     }
    //   }
    //
    //   firebaseKey = firebaseKeys[0];
    //   firebaseValue = firebaseState[firebaseKey];
    // }

    const days = [0,1,2,3,4,5,6];

    return (
      <WeekContainer className="week">
        {days.map((day) => (
          <Day
            key={day}
            day={moment(this.props.weekOf).add(day, "days")}
            tabbingEnabled={this.props.index === 1}
            // textCount={firebaseKeys.length}
            // loading={firebaseState ? false : true}
            //        text={firebaseValue ? firebaseValue.text : null}
            // lastUpdated={firebaseValue ? firebaseValue.lastUpdated : null}
            focusDay={this.props.focusDay}
            saveTodo={this.saveTodo}
          />
        ))}
      </WeekContainer>
    );
  }
}

reactMixin(Week.prototype, ReactFire);
export default Week;
