import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import firebase from "firebase";

class DataExport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    if (this.props.uid) {
      this.bindFirebase(this.props.uid);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid) {
      if (this.firebaseRefs.firebase) {
        this.unbind("firebase");
      }
      if (this.props.uid) {
        this.bindFirebase(nextProps.uid);
      }
    }
  }

  bindFirebase(uid) {
    this.bindAsObject(
      firebase.database().ref(uid).orderByChild("date"),
      "data",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({data: []})
      }.bind(this)
    );
  }

  render() {
    let data;

    if (this.state.data) {
      data = JSON.stringify(this.state.data, null, 2);
    }

    return (
      <textarea
        placeholder={"Fetching your entries…"}
        value={data}
        readOnly={true}
        className="height-5 width-100 size-0-75 padding-0-5 bg-2"
      />
    );
  }
}

reactMixin(DataExport.prototype, ReactFire);
export default DataExport;
