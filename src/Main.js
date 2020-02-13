import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navigator from './layout/navigator/Navigator';

export default function Main() {
  return (
    <Router>
      <div className="main">
        <Navigator/>
        <Switch>
          <Route exact path="/" />
        </Switch>
      </div>
    </Router>
  );
}

