import React from 'react';

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


export default function Section({ match }) {


    return(
        <div>
            {match.params.section}
        </div>
    );
}