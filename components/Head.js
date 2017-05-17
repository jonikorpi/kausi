import React from "react";
import Head from "next/head";

import globalCSS from "../helpers/globalCSS";

export default props => (
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

    <meta content="https://kausi.xyz/static/icon.png?v1" property="og:image" />
    <meta content="600" property="og:image:width" />
    <meta content="600" property="og:image:height" />

    <title>Kausi</title>
    <meta content="Kausi" property="og:title" />

    <meta content="A textarea for every day." name="description" />
    <meta content="A textarea for every day." property="og:description" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@jonikorpi" />

    {props.children}

    <script
      dangerouslySetInnerHTML={{
        __html: `
          var _gauges = _gauges || [];
          window._gauges = _gauges;
          (function() {
            var t   = document.createElement('script');
            t.type  = 'text/javascript';
            t.async = true;
            t.id    = 'gauges-tracker';
            t.setAttribute('data-site-id', '591c235d7218b507370375dc');
            t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
            t.src = 'https://d36ee2fcip1434.cloudfront.net/track.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(t, s);
          })();`,
      }}
    />
  </Head>
);
