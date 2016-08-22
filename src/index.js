import React from 'react';
import ReactDOM from 'react-dom';
import Development from './Development';
import Production from './Production';
import 'jonikorpi-base-files/reset.css';
import 'jonikorpi-base-files/classes.css';
import './main.css';

if (process.env.NODE_ENV === "development") {
  ReactDOM.render(
    <Development/>,
    document.getElementById('root')
  );
}
else {
  ReactDOM.render(
    <Production/>,
    document.getElementById('root')
  );
}
