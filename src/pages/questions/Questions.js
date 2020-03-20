import React, { useState, useEffect } from 'react';
import { Accordion, Card, Table, ProgressBar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TAGS = [
    {
        id: 1,
        title: "Python-1"
    },
    {
        id: 2,
        title: "Python-2"
    },
    {
        id: 3,
        title: "Python-3"
    },
    {
        id: 4,
        title: "Loops-1"
    },
    {
        id: 5,
        title: "Loops-2"
    },
    {
        id: 6,
        title: "Loops-3"
    },
    {
        id: 7,
        title: "Algorithms-1"
    },
    {
        id: 8,
        title: "Algorithms-2"
    },
    {
        id: 9,
        title: "Algorithms-3"
    }
]

export default function Questions() {

    let [sections, setSections] = useState([]);

    useEffect(() => {

        axios({
            method: 'get',
            url: "https://api.irvinecode.net/api/v1/codequizTag",
            header: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);   
        }).catch(err => {
            console.log(err)
        })

        let sections = [];
        TAGS.forEach(tag => {
            let title = tag.title;
            title = title.split("").reverse().join();
            let index = title.indexOf("-");
            let section = tag.title.substring(0, tag.title.length - index);
            let found = false;
            sections.forEach(s => {
                if(s.section === section) {
                    s.tags.push(tag);
                    found = true;
                }
            })
            if(!found) sections.push({
                section: section,
                tags: [tag]
            });
        })
        setSections(sections);
    }, [])

    return (
        <Accordion defaultActiveKey="0">
            {sections.map((section, index) => <Section section={section} key={"section-" + index} index={index} />)}
        </Accordion>
    );
}


function Section({ section, index }) {

    return (
        <Card>
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
        <Table striped bordered hover size="sm" responsive="lg">
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Progress</th>
                </tr>
            </thead>
            <tbody>
                {tags.map(tag => <tr key={tag.id}>
                    <td style={{ width: "30%" }}><Nav.Link as={Link} to={`/tag/${tag.title}`}>{tag.title}</Nav.Link></td>
                    <td style={{ width: "70%" }}><ProgressBar animated now={Math.floor(Math.random() * 100)} /></td>
                </tr>)}
            </tbody>
        </Table>
    )
}