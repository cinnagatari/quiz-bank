import React, { useState, useEffect } from "react";
import path from "path";
import fs from "fs";
import ls from "../../storage/ls";
import { Link } from "react-router-dom";
import { Splicer } from "./Splicer";
import { exec } from "child_process";
import { Button, ButtonGroup, ProgressBar, Spinner } from "react-bootstrap";
import SimpleMDE from "react-simplemde-editor";
import AceEditor from "react-ace";
import "easymde/dist/easymde.min.css";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-tomorrow_night";

const LANGUAGES = ["python", "java"];
const QUESTION = {
    text: "",
    java: "",
    python: ""
};

export default function Question({ match }) {
    let [question, setQuestion] = useState(QUESTION);
    let [prompt, setPrompt] = useState("");
    let [source, setSource] = useState("");
    let [output, setOutput] = useState("");
    let [mode, setMode] = useState("java");
    let [progress, setProgress] = useState(0);
    let [syncing, setSyncing] = useState(false);
    let [synced, setSynced] = useState(false);

    function test(submit) {
        let input = Splicer.compile(source, question[mode], mode);
        if (input === "") {
            setOutput("Question needs to be updated.");
            return;
        }
        let p = path.resolve() + "\\";
        let f = "Solution" + (mode === "python" ? ".py" : ".java");
        fs.writeFile(p + f, submit ? input : source, err => {
            if (mode === "java")
                exec(
                    "javac " + f,
                    {
                        cwd: p
                    },
                    (error, stdout, stderr) => {
                        if (error) setOutput("" + error);
                        else
                            exec(
                                mode + " " + f.substring(0, f.length - 5),
                                {
                                    cwd: p
                                },
                                (error, stdout, stderr) => {
                                    if (error) setOutput("" + error);
                                    if (stderr) setOutput("" + stderr);
                                    if (submit) progressCheck("" + stdout);
                                    else setOutput(stdout);
                                }
                            );
                    }
                );
            else
                exec(
                    mode + " " + f,
                    {
                        cwd: p
                    },
                    (error, stdout, stderr) => {
                        if (submit) progressCheck("" + stdout);
                        else setOutput(stdout);
                    }
                );
        });
    }

    function progressCheck(output) {
        let ar = output.split("\n");
        let total = parseInt(ar[0]);
        let correct = parseInt(ar[1]);
        setProgress((correct / total) * 100);
        if ((correct / total) * 100 === 100) setOutput("All correct!");
        else setOutput(output);
        if (correct > 0)
            ls.submitQuiz(
                match.params.id,
                match.params.tag,
                correct,
                total,
                source,
                mode,
                question
            );
    }

    function reset() {
        setSource(Splicer.stripHidden(question[mode], mode));
    }

    function sync() {
        setSyncing(true);
        ls.syncQuestion(match.params.id).then(res => {
            setQuestion(res.question);
            setPrompt(res.question.text);
            if (res.submission) {
                setSource(res.submission.source);
                setProgress(
                    (res.submission.correct / res.submission.total) * 100
                );
            } else {
                setSource(Splicer.stripHidden(res.question[mode], mode));
            }
            setSyncing(false);
            setSynced(true);
        });
    }

    useEffect(() => {
        ls.getQuiz(match.params.id).then(res => {
            ls.setLastQuestion(res.question);
            setQuestion(res.question);
            setPrompt(res.question.text);
            if (res.submission) {
                setSource(res.submission.source);
                setProgress(
                    (res.submission.correct / res.submission.total) * 100
                );
            } else {
                let source = Splicer.stripHidden(res.question[mode], mode);
                setSource(source);
            }
        });
    }, []);

    useEffect(() => {
        setSource(Splicer.stripHidden(question[mode], mode));
    }, [mode]);

    return (
        <div className="flex-column center">
            <div style={{ display: "flex", width: "100%" }}>
                <div className="flex-row-between-center">
                    <Button
                        as={Link}
                        to={`/tag/${match.params.tag}`}
                        style={{ minWidth: "100px" }}
                        variant="info"
                    >
                        Back
                    </Button>
                    <Button
                        variant={synced ? "success" : "primary"}
                        onClick={() => sync()}
                        style={{ minWidth: "100px", marginLeft: "5px" }}
                    >
                        {syncing ? (
                            <Spinner animation="border" variant="light" />
                        ) : synced ? (
                            "Synced"
                        ) : (
                            "Sync"
                        )}
                    </Button>
                </div>
                <ModeSelector
                    mode={mode}
                    setMode={setMode}
                    tag={match.params.tag}
                    sync={sync}
                />
            </div>
            <Prompt prompt={prompt} />
            <CodeEditor source={source} setSource={setSource} mode={mode} />
            <div className="btn-container-1">
                <div>
                    <ProgressBar
                        animated
                        variant={progress === 100 ? "success" : "info"}
                        now={progress}
                    />
                </div>
                <div>
                    <Button variant="info" onClick={() => test(false)}>
                        Test
                    </Button>
                    <Button variant="info" onClick={() => test(true)}>
                        Submit
                    </Button>
                    <Button variant="danger" onClick={() => reset()}>
                        Reset
                    </Button>
                </div>
            </div>
            <Output output={output} />
        </div>
    );
}

function ModeSelector({ mode, setMode, tag, sync }) {
    return (
        <div style={topContainer}>
            <ButtonGroup style={{ width: "25%" }}>
                {LANGUAGES.map(l => (
                    <Button
                        variant="info"
                        active={l === mode}
                        onClick={() => setMode(l)}
                        key={l}
                    >
                        {l}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    );
}

function Prompt({ prompt }) {
    let previewOnLoad = instance => {
        instance.togglePreview();
    };
    return (
        <SimpleMDE
            getMdeInstance={previewOnLoad}
            value={prompt}
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
            theme="tomorrow_night"
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
            theme="tomorrow_night"
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
    width: "100%",
    height: "600px",
    borderRadius: "5px 5px 10px 10px",
    margin: "0px 5px 5px 5px"
};

const promptStyle = {
    width: "100%",
    margin: "5px 5px 0px 5px",
    borderRadius: "10px 10px 5px 5px",
    backgroundColor: "lightskyblue"
};

const outputStyle = {
    width: "100%",
    margin: "5px",
    borderRadius: "10px",
    minHeight: "50px"
};

const topContainer = {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end"
};
