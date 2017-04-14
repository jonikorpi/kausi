import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import firebase from "firebase";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class ExportData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    initializeFirebase();

    if (this.props.uid) {
      this.bindFirebase(this.props.uid);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid) {
      if (this.firebaseRefs.firebase) {
        this.unbind("firebase");
      }
      if (nextProps.uid) {
        this.bindFirebase(nextProps.uid);
      }
    }
  }

  bindFirebase(uid) {
    this.bindAsObject(
      firebase.database().ref(uid).orderByChild("date"),
      "data",
      function(error) {
        console.log("Firebase subscription cancelled:");
        console.log(error);
        this.setState({ data: [] });
      }.bind(this)
    );
  }

  render() {
    let data;

    if (this.state.data) {
      data = JSON.stringify(this.state.data, null, 2);
    }

    return (
      <div>
        <Head />
        <Navigation />
        <textarea
          placeholder={"Fetching your entries…"}
          value={data}
          readOnly={true}
          className="height-5 width-100 size-0-75 padding-0-5 bg-2"
        />
      </div>
    );
  }
}

reactMixin(ExportData.prototype, ReactFire);
