import React, { useState, useEffect } from "react";
import path from "path";
import fs from "fs";
import storage from "electron-json-storage";
import axios from 'axios';
import { exec } from "child_process";
import { Button, ButtonGroup } from "react-bootstrap";
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
    template: "def solve(list):",
    driver: "print( solve([1,2,3,7,2]) )"
};

export default function Question({ match }) {
    let [question, setQuestion] = useState({ text: "hi" });
    let [driver, setDriver] = useState("");
    let [source, setSource] = useState("");
    let [output, setOutput] = useState("");
    let [mode, setMode] = useState("python");

    function test() {
        let p = path.resolve(__dirname) + `temp\\`;
        p = p + "output.py";
        fs.writeFile(p, source + "\n" + driver, err => {
            if (err) console.log(err);
            else
                exec("python " + p, (error, stdout, stderr) => {
                    if (error) console.log(error);
                    if (stderr) console.log(stderr);
                    setOutput(stdout);
                });
        });
    }

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
        storage.get('token', (err, data) => {
            if(err) console.log(err);
            else {
                axios({
                    url: `http://api.irvinecode.net/api/v1/codequiz/${match.params.id}`,
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                }).then(res => {
                    console.log(res.data);
                    setQuestion(res.data)
                }).catch(err => {   
                    console.log(err);
                })
            }
        })
    }, []);

    return (
        <div className="flex-column center">
            <Prompt question={question.text} />
            <CodeEditor source={source} setSource={setSource} mode={mode} />
            <DriverEditor driver={driver} setDriver={setDriver} mode={mode} />
            <div>
            <Button variant="primary" onClick={() => test()}>Test</Button>
            <Button variant="primary" onClick={() => submit()}>
                Submit
            </Button>
            </div>
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

function DriverEditor({ driver, setDriver }) {
    return (
        <AceEditor
            mode="python"
            theme="github"
            value={driver}
            onChange={value => setDriver(value)}
            fontSize="18px"
            name="code"
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            style={driverStyle}
            maxLines={Infinity}
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

const driverStyle = {
    width: "100%",
    margin: "5px",
    borderRadius: "10px",
    minHeight: "50px"
}

const codeStyle = {
    width: "100%",
    height: "600px",
    borderRadius: "5px 5px 10px 10px",
    margin: "0px 5px 5px 5px",
};

const promptStyle = {
    width: "100%",
    margin: "5px 5px 0px 5px",
    borderRadius: "10px 10px 5px 5px"
};

const outputStyle = {
    width: "100%",
    margin: "5px",
    borderRadius: "10px",
    minHeight: "50px",
}
