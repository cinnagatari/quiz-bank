import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import storage from "electron-json-storage";
import { Card, CardColumns, Button } from "react-bootstrap";

export default function Tag({ match }) {
    let [questions, setQuestions] = useState([]);
    let [progress, setProgress] = useState([]);

    useEffect(() => {
        storage.get("tag-" + match.params.id, (err, data) => {
            if (err) console.log(err);
            setProgress(data);
            storage.get("userdata", (err, data) => {
                axios({
                    url: `http://api.irvinecode.net/api/v1/codequiz?tag=${match.params.id}`,
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                })
                    .then(res => {
                        setQuestions(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        });
    }, []);

    return (
        <CardColumns style={{ flexWrap: "wrap" }}>
            {questions.map((q, i) => (
                <Question
                    question={q}
                    key={i}
                    progress={progress}
                    tag={match.params.id}
                />
            ))}
        </CardColumns>
    );
}

function Question({ question, progress, tag }) {
    return (
        <Card bg="dark" key={question.id} text="white">
            <Card.Header>{question.name}</Card.Header>
            <Card.Body>
                <Button
                    variant={checkProgress(progress, question.id)}
                    as={Link}
                    to={`/question/${tag}/${question.id}`}
                >
                    {checkProgress(progress, question.id, true)}
                </Button>
            </Card.Body>
        </Card>
    );
}

function checkProgress(progress, id, text) {
    let p = progress["submission-" + id];
    if (text && p) {
        if (p.total === p.correct) return "Completed";
        else return "In Progress";
    }
    if (text) return "View Question";
    if (p) {
        if (p.total === p.correct) return "success";
        else return "warning";
    }
    return "secondary";
}
