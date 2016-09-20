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

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));

  if (process.env.NODE_ENV === "production") {
    const trackingObject = {
      dp: req.originalUrl,
      dh: "https://kausi.xyz",
      dt: "Kausi",
      uip: req.ip || undefined,
    };
    console.log(trackingObject);
    req.visitor.pageview(trackingObject).send();
  }
});

module.exports = app;
