import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

import Day from "./Day"

class DayContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firebase: undefined,
    };

    this.bindFirebase = this.bindFirebase.bind(this);
    this.saveTodo = this.saveTodo.bind(this);
  }

  componentDidMount() {
    if (this.props.uid) {
      this.bindFirebase(this.props.uid, this.props.day);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid || nextProps.day.valueOf() !== this.props.day.valueOf()) {
      if (this.firebaseRefs.firebase) {
        this.unbind("firebase");
      }
      if (nextProps.uid) {
        this.bindFirebase(nextProps.uid, nextProps.day);
      }
    }
  }

  bindFirebase(uid, day) {
    this.bindAsObject(
      firebase.database().ref(uid).orderByChild("date").equalTo(day.valueOf()),
      "firebase",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({firebase: undefined})
      }.bind(this)
    );
  }

  saveTodo(text, lastUpdated, day, firebaseKey) {
    if (this.props.uid && lastUpdated && day) {
      let firebaseRef = firebase.database().ref(this.props.uid);

      if (!firebaseKey && text) {
        firebaseKey = firebaseRef.push().key;
      }

      if (firebaseKey) {
        if (text) {
          firebaseRef.update({
            [firebaseKey]: {
              date: day.valueOf(),
              text: text,
              lastUpdated: lastUpdated,
            }
          });
        }
        else {
          firebaseRef.update({
            [firebaseKey]: null
          });
        }
      }
    }
  }

  render() {
    let firebaseValue, firebaseKey;
    let firebaseKeys = [];
    const firebaseState = this.state.firebase;

    if (firebaseState) {
      for (let key in firebaseState) {
        if (firebaseState.hasOwnProperty(key) && !key.startsWith(".")) {
          firebaseKeys.push(key);
        }
      }

      firebaseKey = firebaseKeys[0];
      firebaseValue = firebaseState[firebaseKey];
    }

    return (
      <Day
        {...this.props}
        firebaseKey={firebaseKey}
        saveTodo={this.saveTodo}
        textCount={firebaseKeys.length}
        loading={firebaseState ? false : true}
               text={firebaseValue ? firebaseValue.text : null}
        lastUpdated={firebaseValue ? firebaseValue.lastUpdated : null}
      />
    );
  }
}

reactMixin(DayContainer.prototype, ReactFire);
export default DayContainer;
