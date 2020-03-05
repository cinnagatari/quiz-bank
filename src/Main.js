import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navigator from './layout/navigator/Navigator';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import Questions from './pages/questions/Questions';
import UserContext from './util/UserContext';
import Section from './pages/section/Section';
import Footer from './layout/footer/Footer';

const USER = {
  username: "David Chang"
}


export default function Main() {



  return (
    <Router>
      <UserContext.Provider value={USER}>
        <div className="main">
          <Navigator />
          <div className="page">
            <Switch>
              <Route path="/profile" component={Profile} />
              <Route path="/questions" component={Questions} />
              <Route path={`/section/:section`} component={Section} />
              <Route exact path="/" component={Dashboard} />
            </Switch>
          </div>
          <Footer />
        </div>
      </UserContext.Provider>
    </Router>
  );
}

