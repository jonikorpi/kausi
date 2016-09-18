import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

import Day from "./Day"

class DayContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firebase: [],
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
    this.bindAsArray(
      firebase.database().ref(uid).orderByChild("date").equalTo(day.valueOf()),
      "firebase",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({firebase: {}})
      }.bind(this)
    );
  }

  saveTodo(text, lastUpdated, day) {
    if (this.props.uid && lastUpdated && day) {
      let firebaseRef = firebase.database().ref(this.props.uid);
      let key = this.state.firebase[0] ? this.state.firebase[0][".key"] : null;

      if (!key && text) {
        key = firebaseRef.push().key;
      }

      if (key) {
        if (text) {
          firebaseRef.update({
            [key]: {
              date: day,
              text: text,
              lastUpdated: lastUpdated,
            }
          });
        }
        else {
          firebaseRef.update({
            [key]: null
          });
        }
      }
    }
  }

  render() {
    let text, lastUpdated;

    if (this.state.firebase[0]) {
      text = this.state.firebase[0].text;
      lastUpdated = this.state.firebase[0].lastUpdated;
    }

    return (
      <Day
        {...this.props}
        saveTodo={this.saveTodo}
        textCount={this.state.firebase.length}
        text={text}
        lastUpdated={lastUpdated}
      />
    );
  }
}

reactMixin(DayContainer.prototype, ReactFire);
export default DayContainer;
