import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../../util/UserContext';

export default function Navigator() {

    let user = useContext(UserContext).username;

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/"><img className="logo" alt="logo" src="https://i.imgur.com/eMcz8Xs.png" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/questions">Questions</Nav.Link>
                </Nav>
                <Nav className="justify-content-end">
                    <NavDropdown title={user} id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

