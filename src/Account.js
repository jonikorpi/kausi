import React, { Component } from "react";

import Form from "./Form";
import Button from "./Button";

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    let error;

    if (this.props.error) {
      error = (
        <p className="color-bright-6 text-align-center">{this.props.error}</p>
      );
    }

    return (
      <div className="grow bg-1 flex vertical justify-center align-center child-margins-y-1 padding-0-5 max-width-5 enter-zoom">
        <Button
          label="Log out"
          onClick={this.props.signOut}
          className="rounded"
        />
      </div>
    );
  }
}

export default Account;
