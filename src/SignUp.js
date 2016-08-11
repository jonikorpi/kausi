import React, { Component } from "react";

import Form from "./Form";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  onEmailChange(value) {
    this.setState({email: value})
  }

  onPasswordChange(value) {
    this.setState({password: value})
  }

  signUp(fields) {
    if (fields.email.value && fields.password.value) {
      this.props.signUp(fields.email.value, fields.password.value);
    }
  }

  render() {
    return (
      <div className="grow bg-1 flex vertical justify-center align-center child-margins-y-1 padding-0-5 max-width-5 enter-zoom">
        <p className="color-3">Your current data will carry over to your new account.</p>
        <Form
          onSubmit={this.signUp}
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
        />
      </div>
    );
  }
}

export default SignUp;
