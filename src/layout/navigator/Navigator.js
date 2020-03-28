import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const VERSION = 2;

export default function Navigator() {
    let [update, setUpdate] = useState(true);

    useEffect(() => {
        axios({
            url: "http://api.irvinecode.net/version",
            method: "get"
        })
            .then(res => {
                if (VERSION !== res.data.version) setUpdate(true);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="navigator">
            <Navbar.Brand as={Link} to="/">
                <img
                    className="logo"
                    alt="logo"
                    src="https://i.imgur.com/eMcz8Xs.png"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">
                        Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/tags">
                        Questions
                    </Nav.Link>
                    {update && (
                        <Button style={{}}>
                            <a
                                className="link-override"
                                href="https://google.com"
                                target="_blank"
                            >
                                Update Available!
                            </a>
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
