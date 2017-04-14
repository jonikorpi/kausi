import React, { Component } from "react";

export default props => (
  <div>
    <p>
      Kausi is being maintained and developed as a personal tool. It will always be free to use.
    </p>
    <p>
      To stay in touch, follow
      {" "}
      <a className="underlined" href="https://twitter.com/jonikorpi">
        @jonikorpi
      </a>
      {" "}
      or visit
      {" "}
      <a className="underlined" href="http://vuoro.design/">vuoro.design</a>
      .
    </p>
    <p>
      <a className="underlined" href="https://github.com/jonikorpi/kausi/">
        Source code
      </a>
      {" "}
      |
      {" "}
      <a
        className="underlined"
        href="https://github.com/jonikorpi/kausi/blob/master/PRIVACY_POLICY.md"
      >
        Privacy policy
      </a>
      {" "}
      |
      {" "}
      <a
        className="underlined"
        href="https://github.com/jonikorpi/kausi/blob/master/TERMS_OF_SERVICE.md"
      >
        Terms of service
      </a>
    </p>
  </div>
);
