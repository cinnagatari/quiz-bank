import React, { useState } from 'react';

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

    let [source, setSource] = useState("");


    function submit() {
        let path = __dirname;


    }

    return(
        <div>
            {match.params.section}
            <textarea value={source} onChange={val => setSource(val.target.value)}></textarea>
            <button onClick={() => submit()}>submit</button>
        </div>
    );
}