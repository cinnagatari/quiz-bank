import React, { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Navigator from "./layout/navigator/Navigator";
import Profile from "./pages/profile/Profile";
import Questions from "./pages/questions/Questions";
import Tags from "./pages/tags/Tags";
import Question from "./pages/question/Question";
import Login from "./pages/login/Login";
import storage from "electron-json-storage";
import Dashboard from "./pages/dashboard/Dashboard";

export default function Main() {
    let [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        
        storage.get("userdata", (err, data) => {
            if (err) console.log(err);
            if (Object.keys(data).length > 0) setLoggedIn(true);
        });
    }, []);

    return (
        <Router>
            <div className="main">
                <Navigator />
                {!loggedIn && <Login setLoggedIn={setLoggedIn} />}
                {loggedIn && (
                    <div className="page-container">
                        <Switch>
                            <Route path="/profile" component={Profile} />
                            <Route path="/tags" component={Tags} />
                            <Route exact path={`/tag/:tag/:id`} component={Question} />
                            <Route exact path={`/tag/:id`} component={Questions} />
                            <Route exact path={"/"} component={Dashboard} />
                        </Switch>
                    </div>
                )}
            </div>
        </Router>
    );
}
