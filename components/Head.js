import React, { useEffect } from "react";
import Head from "next/head";

import globalCSS from "../helpers/globalCSS";

export default props => {
  useEffect(() => {
    (function(f, a, t, h, o, m) {
      a[h] =
        a[h] ||
        function() {
          (a[h].q = a[h].q || []).push(arguments);
        };
    })(document, window, "//analytics.jonikorpi.com/tracker.js", "fathom");

    if (window.fathom) {
      window.fathom("set", "siteId", "VJSNU");
      window.fathom("trackPageview");
    }
  }, []);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <style
        dangerouslySetInnerHTML={{
          __html: globalCSS.reset + globalCSS.fontFace + globalCSS.base,
        }}
      />

      <link rel="manifest" href="/static/manifest.json?v1" />
      {/* <meta name="apple-mobile-web-app-capable" content="yes"/> */}
      <meta name="mobile-web-app-capable" content="yes" />

      <link
        href="/static/favicon.png?v1"
        rel="shortcut icon"
        type="image/png"
        sizes="any"
      />
      <link
        href="/static/favicon.svg?v1"
        rel="shortcut icon"
        type="image/svg+xml"
        sizes="any"
      />

      <link
        href="/static/icon.png?v1"
        rel="apple-touch-icon-precomposed"
        type="image/png"
        sizes="any"
      />

      <meta
        content="https://kausi.xyz/static/icon.png?v1"
        property="og:image"
      />
      <meta content="600" property="og:image:width" />
      <meta content="600" property="og:image:height" />

      <title>Kausi</title>
      <meta content="Kausi" property="og:title" />

      <meta content="A textarea for every day." name="description" />
      <meta content="A textarea for every day." property="og:description" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@jonikorpi" />

      <script
        async
        src="//analytics.jonikorpi.com/tracker.js"
        id="fathom-script"
      />

      {props.children}
    </Head>
  );
};
