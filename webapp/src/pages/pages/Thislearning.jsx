import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, FormControl, InputGroup } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import './tTstyle.scss';

function Thislearning() {
    return (
        <>
            <Container className="task">
                <Row>
                    <Col md={7} className="task-text">
                        <h2 className="text-left h2">*Name learning*</h2>
                        <h4 className="text-left h4">*Something new for you*</h4>
                        <Button variant="outline-secondary" className="a" href="task-file" download="name-task">Download file</Button>
                    </Col>

                    <Col>
                        <Image src="img-b/thisLearning.jpg" alt="Learning" className="img-fluid" />
                    </Col>

                    <Row>
                        <h4 className="text-center mb-3 mt-3">А теперь проверим свои знания?</h4>

                        <Col>
                            <Row>
                                <Col className="all-info">
                                    <h5 className="text-center new-info p-1 pl-3">Task about new information <Button href="Thistask" className="btn btn-light" >></Button></h5>
                                    <h5 className="text-center new-info p-3">Check your ability</h5>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    )
}

export default Thislearning
