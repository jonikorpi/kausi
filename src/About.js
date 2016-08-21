import React, { Component } from "react";

class About extends Component {
  render() {
    return (
      <div className="color-4 child-margins-y-1 wide-max-width margin-auto-x">
        <p>
          Kausi is being maintained and developed as a personal tool. It will always be free to use.
        </p>
        <p>
          To stay in touch, follow <a className="underlined" href="https://twitter.com/jonikorpi">@jonikorpi</a> or visit <a className="underlined" href="http://vuoro.design/">vuoro.design</a>.
        </p>
        <p>
          The source code can be found on <a className="underlined" href="https://github.com/jonikorpi/kausi/">GitHub</a>.
        </p>
      </div>
    );
  }
}

export default About;
