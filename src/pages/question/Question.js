import React, { useState, useEffect } from "react";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { Button } from "react-bootstrap";
import SimpleMDE from "react-simplemde-editor";
import AceEditor from "react-ace";
import "easymde/dist/easymde.min.css";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

const QUESTION = {
    id: 1,
    title: "findMax",
    question: "Given an array, find the max.",
    template: "def solve(list):"
};

export default function Question({ match }) {
    let [question, setQuestion] = useState(QUESTION);
    let [source, setSource] = useState(QUESTION.template);
    let [output, setOutput] = useState("");

    function submit() {
        let p = path.resolve(__dirname) + `temp\\`;
        p = p + "output.py";
        fs.writeFile(p, source, err => {
            if (err) console.log(err);
            else
                exec("python " + p, (error, stdout, stderr) => {
                    if (error) console.log(error);
                    if (stderr) console.log(stderr);
                    setOutput(stdout);
                });
        });
    }

    useEffect(() => {
        console.log(match.params.question);
    }, []);

    return (
        <div className="flex-column center">
            <Prompt question={question.question} />
            <CodeEditor source={source} setSource={setSource} />
            <Button variant="primary" onClick={() => submit()}>
                Submit
            </Button>
            <Output output={output} />
        </div>
    );
}

function Prompt({ question }) {
    let previewOnLoad = instance => {
        instance.togglePreview();
    };
    return (
        <SimpleMDE
            getMdeInstance={previewOnLoad}
            value={question}
            options={{
                lineWrapping: false,
                spellChecker: false,
                toolbar: false,
                status: false
            }}
            style={promptStyle}
        />
    );
}

function CodeEditor({ source, setSource }) {
    return (
        <AceEditor
            mode="python"
            theme="github"
            value={source}
            onChange={value => setSource(value)}
            fontSize="18px"
            name="code"
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            style={codeStyle}
        />
    );
}

function Output({ output }) {
    return (
        <AceEditor
            mode="python"
            theme="github"
            value={output}
            fontSize="18px"
            name="output"
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            style={outputStyle}
            maxLines={Infinity}
        />
    );
}

const codeStyle = {
    width: "80%",
    height: "600px",
    borderRadius: "5px 5px 10px 10px",
    margin: "0px 5px 5px 5px",
};

const promptStyle = {
    width: "80%",
    margin: "5px 5px 0px 5px",
    borderRadius: "10px 10px 5px 5px"
};

const outputStyle = {
    width: "80%",
    margin: "5px",
    borderRadius: "10px",
    minHeight: "50px",
}
