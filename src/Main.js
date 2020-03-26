import React, { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Navigator from "./layout/navigator/Navigator";
import Profile from "./pages/profile/Profile";
import Questions from "./pages/questions/Questions";
import Footer from "./layout/footer/Footer";
import Tag from "./pages/tag/Tag";
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

    function clearStorage() {
        storage.clear(err => {
            if(err) console.log(err);
            setLoggedIn(false);
        })
    }

    return (
        <Router>
            <div className="main">
                <Navigator />
                {!loggedIn && <Login setLoggedIn={setLoggedIn} />}
                {loggedIn && (
                    <div className="page-container">
                        <Switch>
                            <Route path="/profile" component={Profile} />
                            <Route path="/questions" component={Questions} />
                            <Route path={`/tag/:id`} component={Tag} />
                            <Route path="/question/:tag/:id" component={Question} />
                            <Route exact path={"/"} component={Dashboard} />
                        </Switch>
                    </div>
                )}
                {/* <button onClick={() => clearStorage()}>clear</button> */}
                <Footer />
            </div>
        </Router>
    );
}
