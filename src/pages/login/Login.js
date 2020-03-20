import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function Login() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    async function login() {
        await fetch("http://api.irvinecode.net/api/v1/users/signin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            res.json().then(data => {
                console.log(data.token.token);
            })
        });
    }

    return (
        <Form className="login-container">
            <Form.Group controlId="formGroupEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                />
            </Form.Group>
            <Button onClick={() => login()}>Login</Button>
        </Form>
    );
}
