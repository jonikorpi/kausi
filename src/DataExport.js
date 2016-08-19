import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

class DataExport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentWillMount() {
    this.bindFirebase(this.props.firebaseRef);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.firebaseRef !== this.props.firebaseRef
    ) {
      this.unbind("data");
      this.bindFirebase(nextProps.firebaseRef);
    }
  }

  bindFirebase(firebaseRef, targetDay, weekRange) {
    this.bindAsObject(
      firebaseRef.orderByChild("date"),
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
        defaultValue={"Fetching your entries…"}
        value={data}
        readOnly={true}
        className="grow width-100 size-0-75"
      />
    );
  }
}

reactMixin(DataExport.prototype, ReactFire);
export default DataExport;
