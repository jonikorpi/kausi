const env = (process && process.env && process.env.NODE_ENV) || "development";

if (typeof window !== "undefined" && !window.rollbar) {
  window.rollbar = require("rollbar");
  window.Rollbar = new window.rollbar({
    accessToken: "1591caa2cfcf460791065f7c67646373",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: env,
    },
  });
}
