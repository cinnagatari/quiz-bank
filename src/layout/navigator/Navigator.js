import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import storage from "electron-json-storage";

export default function Navigator() {
    let [user, setUser] = useState(undefined);

    useEffect(() => {
        storage.get("userdata", (err, data) => {
            if (err) console.log(err);
            if (Object.keys(data).length > 0) setUser(data);
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
                    <Nav.Link as={Link} to="/questions">
                        Questions
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
