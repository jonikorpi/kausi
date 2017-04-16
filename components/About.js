import React from "react";

export default props => (
  <div className="about">
    <style jsx>{`
      .about {
        font-size: 0.625rem;
        line-height: 1rem;
        display: flex;
        flex-wrap: wrap;
        align-items: top;
        justify-content: center;
      }

      .about a {
        padding: 0 0.25rem;
        white-space: nowrap;
      }
    `}</style>

    <a href="https://twitter.com/jonikorpi">
      @jonikorpi
    </a>
    <a href="http://vuoro.design/">vuoro.design</a>
    <a href="https://github.com/jonikorpi/kausi/">
      Source code
    </a>
    <a href="https://github.com/jonikorpi/kausi/issues/">
      Bug reports
    </a>
    <a href="https://github.com/jonikorpi/kausi/blob/master/PRIVACY_POLICY.md">
      Privacy policy
    </a>
    <a href="https://github.com/jonikorpi/kausi/blob/master/TERMS_OF_SERVICE.md">
      Terms of service
    </a>
  </div>
);
