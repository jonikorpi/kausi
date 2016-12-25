import React, { Component } from "react";
import moment from "moment";
// import firebase from "firebase";
// import reactMixin from "react-mixin";
// import ReactFire from "reactfire";

import Day from "./Day";

class Week extends Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     firebase: undefined,
  //   };
  //
  //   this.bindFirebase = this.bindFirebase.bind(this);
  //   this.saveTodo = this.saveTodo.bind(this);
  // }
  //
  // componentDidMount() {
  //   if (this.props.uid) {
  //     this.bindFirebase(this.props.uid, this.props.weekOf);
  //   }
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.uid !== this.props.uid || nextProps.weekOf.valueOf() !== this.props.weekOf.valueOf()) {
  //     if (this.firebaseRefs.firebase) {
  //       this.unbind("firebase");
  //     }
  //     if (nextProps.uid) {
  //       this.bindFirebase(nextProps.uid, nextProps.weekOf);
  //     }
  //   }
  // }
  //
  // bindFirebase(uid, weekOf) {
  //   this.bindAsObject(
  //     firebase.database()
  //       .ref(uid)
  //       .orderByChild("date")
  //       .startAt(weekOf.valueOf())
  //       .endAt(moment(weekOf).endOf("week").valueOf()),
  //     "firebase",
  //     function(error) {
  //       console.log("Firebase subscription cancelled:")
  //       console.log(error);
  //       this.setState({firebase: undefined})
  //     }.bind(this)
  //   );
  // }

  // saveTodo(text, lastUpdated, day, firebaseKey) {
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

    // return (
    //   <Day
    //     {...this.props}
    //     firebaseKey={firebaseKey}
    //     saveTodo={this.saveTodo}
    //     textCount={firebaseKeys.length}
    //     loading={firebaseState ? false : true}
    //            text={firebaseValue ? firebaseValue.text : null}
    //     lastUpdated={firebaseValue ? firebaseValue.lastUpdated : null}
    //   />
    // );

    return (
      <div className="week">
        <style jsx>{`
          .week {
            display: flex;
            height: 100vh;
          }
        `}</style>

        <Day day={moment(this.props.weekOf).add(0, "days")} focusDay={this.props.focusDay} tabbingEnabled={this.props.index === 1}/>
        <Day day={moment(this.props.weekOf).add(1, "days")} focusDay={this.props.focusDay} tabbingEnabled={this.props.index === 1}/>
        <Day day={moment(this.props.weekOf).add(2, "days")} focusDay={this.props.focusDay} tabbingEnabled={this.props.index === 1}/>
        <Day day={moment(this.props.weekOf).add(3, "days")} focusDay={this.props.focusDay} tabbingEnabled={this.props.index === 1}/>
        <Day day={moment(this.props.weekOf).add(4, "days")} focusDay={this.props.focusDay} tabbingEnabled={this.props.index === 1}/>
        <Day day={moment(this.props.weekOf).add(5, "days")} focusDay={this.props.focusDay} tabbingEnabled={this.props.index === 1}/>
        <Day day={moment(this.props.weekOf).add(6, "days")} focusDay={this.props.focusDay} tabbingEnabled={this.props.index === 1}/>
      </div>
    );
  }
}

// reactMixin(DayContainer.prototype, ReactFire);
export default Week;
