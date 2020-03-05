import React, { useState } from 'react';
import { Accordion, Card, Table, ProgressBar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const COURSES = [
    {
        id: 1,
        title: "Python-1",
        sections: [
            "Logic",
            "Loops",
            "Lists"
        ]
    },
    {
        id: 2,
        title: "Python-2",
        sections: [
            "Logic 2",
            "Loops 2",
            "Lists 2"
        ]
    },
    {
        id: 10,
        title: "Algorithms",
        sections: [
            "Algorithms-1",
            "Algorithms-2",
            "Algorithms-3",
            "Algorithms-4",
            "Algorithms-5",
            "Algorithms-6",
        ]
    },
]

export default function Questions() {

    let [courses, setCourses] = useState(COURSES);

    return (
        <Accordion defaultActiveKey="0">
            {courses.map(course => <Course course={course} />)}
        </Accordion>
    );
}


function Course({ course }) {

    return (
        <Card>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={course.id}>
                {course.title}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={course.id}>
                <Card.Body>
                    <Sections sections={course.sections} />
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}

function Sections({ sections }) {

    return (
        <Table striped bordered hover size="sm" responsive="lg">
            <thead>
                <tr>
                    <th>Section</th>
                    <th>Progress</th>
                </tr>
            </thead>
            <tbody>
                {sections.map(section => <tr>
                    <td style={{ width: "30%" }}><Nav.Link as={Link} to={`/section/${section}`}>{section}</Nav.Link></td>
                    <td style={{ width: "70%" }}><ProgressBar animated now={Math.floor(Math.random() * 100)} /></td>
                </tr>)}
            </tbody>
        </Table>
    )
}