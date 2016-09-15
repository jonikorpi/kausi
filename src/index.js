import React from 'react';
import ReactDOM from 'react-dom';
import firebase from "firebase";

import App from './App';

import 'jonikorpi-base-files/reset.css';
import 'jonikorpi-base-files/classes.css';
import './main.css';

firebase.initializeApp({
  authDomain: "muisti-6a29a.firebaseapp.com",
  apiKey: "AIzaSyAF4obcBK8wggQq9klNNkHH-dolEoNhlLM",
  databaseURL: "https://muisti-6a29a.firebaseio.com",
});

if (process.env.NODE_ENV === "development") {
  window.ReactPerf = require('react-addons-perf');
  window.ReactPerf.start();
  // firebase.database.enableLogging(true);
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
