import React, { Component } from "react";

import Button from "./Button";
import Input from "./Input";

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

  signUp(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.state.email && this.state.password) {
      this.props.signUp(this.state.email, this.state.password);
    }
  }

  render() {
    return (
      <div className="grow bg-1 flex vertical justify-center align-center child-margins-y-1 padding-0-5 max-width-5">
        <p className="color-3">Your current data will carry over to your new account.</p>
        <form
          onSubmit={this.signUp}
          className="child-margins-y-hairline flex vertical align-center"
        >
          <Input
            label="Email"
            name="email"
            type="email"
            onChange={this.onEmailChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={this.onPasswordChange}
          />
          <Button type="submit" className="size-1-25" label="Sign up" onClick={this.signUp}/>
        </form>
      </div>
    );
  }
}

export default SignUp;
