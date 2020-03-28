import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Navigator() {

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
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
