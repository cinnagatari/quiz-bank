import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import storage from 'electron-json-storage';
import { Card } from 'react-bootstrap';


export default function Tag({ match }) {

    let [questions, setQuestions] = useState([])

    useEffect(() => {
        storage.get('token', (err, data) => {
            axios({
                url: `http://api.irvinecode.net/api/v1/codequiz?tag=${match.params.id}`,
                method: 'get',
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            }).then(res => {
                setQuestions(res.data);
            }).catch(err => {
                console.log(err);
            })
        })        
    }, [])


    return(
        <div>
            {questions.map(q => <Question question={q} />)}
        </div>
    );
}

function Question({ question }) {

    return (
        <Card key={question.id}>
            <Card.Body as={Link} to={`/question/${question.id}`}>
                <Card.Title>{question.name}</Card.Title>
            </Card.Body>
        </Card>
    );
}