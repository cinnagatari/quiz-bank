import React, { useState, useEffect } from "react";
import { Accordion, Card, Table, ProgressBar, Nav } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import storage from "electron-json-storage";

export default function Questions() {
    let [sections, setSections] = useState([]);
    let [progress, setProgress] = useState({});

    useEffect(() => {
        storage.get("tags", (err, data) => {
            if (Object.keys(data).length === 0)
                storage.get("userdata", (err, data) => {
                    axios({
                        method: "get",
                        url: "https://api.irvinecode.net/api/v1/codequizTag",
                        headers: {
                            Authorization: `Bearer ${data.token}`
                        }
                    })
                        .then(res => {
                            let TAGS = res.data;
                            let sections = [];
                            TAGS.forEach(tag => {
                                let title = tag.name;
                                title = title
                                    .split("")
                                    .reverse()
                                    .join();
                                let index = title.indexOf("-");
                                let section = tag.name.substring(
                                    0,
                                    tag.name.length - index
                                );
                                let found = false;
                                sections.forEach(s => {
                                    if (s.section === section) {
                                        s.tags.push(tag);
                                        found = true;
                                    }
                                });
                                if (!found)
                                    sections.push({
                                        section: section,
                                        tags: [tag]
                                    });
                            });
                            storage.set("tags", sections, (err) => {
                                setSections(sections);
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
            else setSections(data);
        });
    }, []);

    return (
        <Accordion variant="dark" defaultActiveKey="0">
            {sections.map((section, index) => (
                <Section
                    section={section}
                    key={"section-" + index}
                    index={index}
                />
            ))}
        </Accordion>
    );
}

function Section({ section, index }) {
    return (
        <Card bg="dark" text="white">
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={index}>
                {section.section}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index}>
                <Card.Body>
                    <Tags tags={section.tags} />
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}

function Tags({ tags }) {
    return (
        <Table striped bordered hover size="sm" responsive="lg" variant="dark">
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Progress</th>
                </tr>
            </thead>
            <tbody>
                {tags.map(tag => (
                    <tr key={tag.id}>
                        <td style={{ width: "30%" }}>
                            <Nav.Link as={Link} className="link-override" to={`/tag/${tag.id}`}>
                                {tag.name}
                            </Nav.Link>
                        </td>
                        <td style={{ width: "70%" }}>
                            <ProgressBar
                                animated
                                now={Math.floor(Math.random() * 100)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}