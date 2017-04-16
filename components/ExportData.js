import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import firebase from "firebase";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class ExportData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    initializeFirebase();
  }

  bindFirebase = uid => {
    this.bindAsObject(
      firebase.database().ref(uid).orderByChild("date"),
      "data",
      function(error) {
        console.log("Firebase subscription cancelled:");
        console.log(error);
        this.setState({ data: null });
      }.bind(this)
    );
  };

  fetch = () => {
    this.bindFirebase(this.props.uid);
  };

  render() {
    let data;

    if (!this.props.uid) {
      return null;
    }

    if (this.state.data) {
      data = JSON.stringify(this.state.data, null, 2);
    }

    return (
      <div>
        <style jsx>{`
          .exportTextarea {
            background: transparent;
            border: 1px solid;
            width: 100%;
            height: 10rem;
            font-size: 0.625rem;
            line-height: 0.75rem;
          }
        `}</style>

        {this.state.data
          ? <textarea
              className="exportTextarea padding"
              placeholder={"Fetching your entries…"}
              value={data}
              readOnly={true}
            />
          : <button onClick={this.fetch}>
              Fetch your entries
            </button>}
      </div>
    );
  }
}

reactMixin(ExportData.prototype, ReactFire);
