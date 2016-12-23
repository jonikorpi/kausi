import React, { Component } from "react";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";

export default class About extends Component {
  render() {
    return (
      <div className="color-4 child-margins-y-1 wide-max-width margin-auto-x">
        <Head/>
        <Navigation/>
        <p>
          Kausi is being maintained and developed as a personal tool. It will always be free to use.
        </p>
        <p>
          To stay in touch, follow <a className="underlined" href="https://twitter.com/jonikorpi">@jonikorpi</a> or visit <a className="underlined" href="http://vuoro.design/">vuoro.design</a>.
        </p>
        <p>
          <a className="underlined" href="https://github.com/jonikorpi/kausi/">Source code</a> | <a className="underlined" href="https://github.com/jonikorpi/kausi/blob/master/PRIVACY_POLICY.md">Privacy policy</a> | <a className="underlined" href="https://github.com/jonikorpi/kausi/blob/master/TERMS_OF_SERVICE.md">Terms of service</a>
        </p>
      </div>
    );
  }
}
