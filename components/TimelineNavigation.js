import React, { Component } from "react";
import Link from "next/link";
import styled from "styled-components";

const TimelineNavigationContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 1rem;
  right: 0;

  .navigation {
    display: flex;
  }

  .navigation-link {
    padding: 0.5rem;
  }
`;

export default class TimelineNavigation extends Component {
  render() {
    return (
      <TimelineNavigationContainer>
        <nav className="navigation">

          <button
            className="navigation-link"
            type="button"
            onClick={this.props.scrollToToday}
          >
            Today
          </button>

          <Link href="/lists">
            <a className="navigation-link">
              Lists
            </a>
          </Link>

          <Link href="/change-password">
            <a className="navigation-link">
              Account
            </a>
          </Link>

          <Link href="/sign-up">
            <a className="navigation-link">
              Sign up
            </a>
          </Link>

          <Link href="/log-in">
            <a className="navigation-link">
              Log in
            </a>
          </Link>
        </nav>
      </TimelineNavigationContainer>
    );
  }
}
