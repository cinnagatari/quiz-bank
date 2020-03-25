import React, { useState, useEffect } from "react";
import path from "path";
import fs from "fs";
import storage from "electron-json-storage";
import axios from "axios";
import { Splicer } from "./Splicer";
import { exec } from "child_process";
import { Button, ButtonGroup, ProgressBar } from "react-bootstrap";
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

    function test(submit) {
        let input = Splicer.compile(source, question[mode], mode);
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
            storage.get("tag-" + match.params.tag, (err, data) => {
                let key = "submission-" + match.params.id;

                if (
                    typeof data[key] === "undefined" ||
                    data[key].correct < correct
                ) {
                    let body = {
                        user_id: data.uid,
                        quiz_id: match.params.id,
                        pt: correct,
                        pt_outof: total,
                        code: source,
                        type: mode
                    };
                    storage.get("userdata", (err, data) => {
                        axios({
                            url: `http://api.irvinecode.net/api/v1/codequizrecords/me`,
                            method: "post",
                            headers: {
                                Authorization: `Bearer ${data.token}`
                            },
                            data: body
                        })
                            .then(res => {})
                            .catch(err => {});
                    });
                    storage.set("tag-" + match.params.tag, {
                        ...data,
                        [key]: {
                            correct,
                            total,
                            source
                        }
                    });
                }
            });
    }

    function reset() {
        setSource(Splicer.stripHidden(question[mode], mode));
    }

    useEffect(() => {
        storage.get("tag-" + match.params.tag, (err, question) => {
            if (
                Object.keys(question).length === 0 ||
                typeof question["quiz-" + match.params.id] === "undefined"
            )
                storage.get("userdata", (err, data) => {
                    axios({
                        url: `http://api.irvinecode.net/api/v1/codequiz/${match.params.id}`,
                        method: "get",
                        headers: {
                            Authorization: `Bearer ${data.token}`
                        }
                    })
                        .then(res => {
                            storage.set(
                                "tag-" + match.params.tag,
                                {
                                    ...question,
                                    ["quiz-" + match.params.id]: res.data
                                },
                                err => {}
                            );
                            setQuestion(res.data);
                            setPrompt(res.data.text);
                            if (res.data[mode])
                                setSource(
                                    Splicer.stripHidden(res.data[mode], mode)
                                );
                        })
                        .catch(err => {});
                });
            else {
                let q = question["quiz-" + match.params.id];
                setQuestion(q);
                setPrompt(q.text);
                if (question["submission-" + match.params.id]) {
                    let s = question["submission-" + match.params.id];
                    setSource(s.source);
                    setProgress((s.correct / s.total) * 100);
                } else setSource(Splicer.stripHidden(q[mode], mode));
            }
        });
    }, []);

    useEffect(() => {
        setSource(Splicer.stripHidden(question[mode], mode));
    }, [mode]);

    return (
        <div className="flex-column center">
            <ModeSelector mode={mode} setMode={setMode} />
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

function ModeSelector({ mode, setMode }) {
    return (
        <ButtonGroup style={languageStyle}>
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

const languageStyle = {
    width: "25%",
    marginLeft: "75%"
};
