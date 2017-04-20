import React from "react";
import Head from "next/head";

import globalCSS from "../helpers/globalCSS";

const env = (process && process.env && process.env.NODE_ENV) || "development";
const dev = env === "development";
const assetHost = dev ? "/static/" : "https://cdn.kausi.xyz/";

export default props => (
  <Head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <style
      dangerouslySetInnerHTML={{
        __html: globalCSS.reset + globalCSS.fontFace + globalCSS.base,
      }}
    />

    <link rel="manifest" href={`${assetHost}manifest.json?v1`} />
    {/* <meta name="apple-mobile-web-app-capable" content="yes"/> */}
    <meta name="mobile-web-app-capable" content="yes" />

    <link
      href={`${assetHost}favicon.png?v1`}
      rel="shortcut icon"
      type="image/png"
      sizes="any"
    />
    <link
      href={`${assetHost}favicon.svg?v1`}
      rel="shortcut icon"
      type="image/svg+xml"
      sizes="any"
    />

    <link
      href={`${assetHost}icon.png?v1`}
      rel="apple-touch-icon-precomposed"
      type="image/png"
      sizes="any"
    />

    <meta content={`${assetHost}icon.png?v1`} property="og:image" />
    <meta content="600" property="og:image:width" />
    <meta content="600" property="og:image:height" />

    <title>Kausi</title>
    <meta content="Kausi" property="og:title" />

    <meta content="A textarea for every day." name="description" />
    <meta content="A textarea for every day." property="og:description" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@jonikorpi" />

    {props.children}
  </Head>
);
