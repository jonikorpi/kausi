import React, { Component } from "react";

import Form from "./Form";
import Button from "./Button";

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.setPassword = this.setPassword.bind(this);
  }

  setPassword(fields) {
    this.props.setPassword(fields.newPassword.value, fields.newPasswordAgain.value);
  }

  render() {
    let error;

    if (this.props.error) {
      error = (
        <p className="color-bright-6">{this.props.error}</p>
      );
    }

    return (
      <div className="grow bg-1 flex vertical">

        <div className="padding-0-5 bg-2 grow flex vertical align-center justify-center">
          <Form
            colorNumber={1}
            onSubmit={this.setPassword}
            fields={[
              {
                id: "newPassword",
                type: "password",
                label: "New password",
              },
              {
                id: "newPasswordAgain",
                type: "password",
                label: "New password again",
              },
            ]}
            buttonLabel="Change password"
          />
          {error}
        </div>

        <div className="flex even-children bg-5 color-1">
          <Button
            label="Log out"
            onClick={this.props.signOut}
            className="rounded"
          />
        </div>
      </div>
    );
  }
}

export default Account;
