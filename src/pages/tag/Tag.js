import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QUESTIONS = [
    {
        id: 1,
        title: "findMax"
    },
    {
        id: 2,
        title: "findMin"
    }
]


export default function Tag({ match }) {

    let [questions, setQuestions] = useState(QUESTIONS)

    return(
        <div>
            {questions.map(q => <Link to={`/question/${q.title}`}>{q.title}</Link>)}
        </div>
    );
}