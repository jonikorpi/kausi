const express = require('express');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const analytics = require('universal-analytics');

const app = express();

// Enable trust
app.enable('trust proxy');

// Setup gzip
app.use(compression());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] :response-time ms ":method :url HTTP/:http-version" :status :res[content-length]'));

// Setup analytics
app.use(analytics.middleware('UA-3628636-11', {https: true}));

// Serve static assets
app.use("/static", express.static(path.resolve(__dirname, '..', 'build/static')));

// Serve index.html for all non-static things
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  const trackingObject = {
    dp: req.originalUrl,
    dr: req.get('Referrer'),
    dh: "https://kausi.xyz",
    dt: "Kausi",
    uip: req.ip || undefined,
    ua: req.get('user-agent'),
    ul: req.headers['accept-language'].split(",")[0].split(";")[0] || undefined,
  };

  if (process.env.NODE_ENV === "production") {
    req.visitor.pageview(trackingObject).send();
  }
  else {
    console.log(trackingObject);
  }
});

module.exports = app;
