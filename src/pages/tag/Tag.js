import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ls from "../../storage/ls";
import { Card, CardColumns, Button } from "react-bootstrap";

export default function Tag({ match }) {
    let [questions, setQuestions] = useState({ quizzes: [] });

    useEffect(() => {
        ls.getTag(match.params.id).then(data => {
            setQuestions(data);
        });
    }, []);

    return (
        <div className="quiz-container">
            {questions.quizzes.map((q, i) => (
                <Question
                    question={q}
                    key={i}
                    progress={questions}
                    tag={match.params.id}
                />
            ))}
        </div>
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
    let p = progress["quiz-" + id];
    if (typeof p === "undefined" && text) return "View Question";
    if (typeof p === "undefined") return "secondary";

    if (text) {
        if (p) return "Completed";
        else return "In Progress";
    }
    if (p) return "success";
    else return "warning";
}
