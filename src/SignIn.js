import React, { Component } from "react";

import Form from "./Form";
import Button from "./Button";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null,
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  onEmailChange(value) {
    this.setState({email: value})
  }

  onPasswordChange(value) {
    this.setState({password: value})
  }

  signIn(fields) {
    this.props.signIn(fields.email.value, fields.password.value);
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
        <Form
          onSubmit={this.signIn}
          fields={[
            {
              id: "email",
              type: "email",
              label: "Email",
            },
            {
              id: "password",
              type: "password",
              label: "Password",
            },
          ]}
          buttonLabel="Log in"
        />

        {error}

        <Button className="rounded" disabled={true} label="Reset password" onClick={this.props.resetPassword}/>
      </div>
    );
  }
}

export default SignIn;
