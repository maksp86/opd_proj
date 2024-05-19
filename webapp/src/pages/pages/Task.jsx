import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import './ETstyle.scss';

function Task() {
    return (
        <>              
            <Container className="tasks"> 
                <Row>
                    <Col className="fake-cards-task fake-p"></Col>
                        <Col xs={5} className="cards-task">
                            <Row>
                                <Col xs={11}>
                                    <h3>Crypto</h3>
                                    <ProgressBar  now={33} label="33%" className="bg-p" />

                                    <div className="text-right">
                                        <h5>Your last task: *last task*</h5>
                                    </div>
                                </Col>

                                <Col xs={1}>
                                    <Button href="Taskchoose" className="btn btn-light">{'>'}</Button>
                                </Col>
                            </Row>
                    </Col>

                    <Col className="fake-cards-task fake-y"></Col>
                    <Col xs={5} className="cards-task">
                        <Row>
                            <Col xs={11}>
                                <h3>Stego</h3>
                                <ProgressBar  now={33} label="33%" className="bg-y" />

                                <div className="text-right">
                                    <h5>Your last task: *last task*</h5>
                                </div>
                            </Col>
                            <Col xs={1}>
                                <Button href="Taskchoose" className="btn btn-light">{'>'}</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col className="fake-cards-task fake-b"></Col>
                    <Col xs={5} className="cards-task">
                        <Row>
                            <Col xs={11}>
                                <h3>PPC</h3>
                                <ProgressBar  now={33} label="33%" className="bg-b" />

                                <div className="text-right">
                                    <h5>Your last task: *last task*</h5>
                                </div>
                            </Col>
                            <Col xs={1}>
                                <Button href="Taskchoose" className="btn btn-light">{'>'}</Button>
                            </Col>
                        </Row>
                    </Col>

                    <Col className="fake-cards-task fake-r"></Col>
                    <Col xs={5} className="cards-task">
                        <Row>
                            <Col xs={11}>
                                <h3>Web</h3>
                                <ProgressBar  now={33} label="33%" className="bg-r" />

                                <div className="text-right">
                                    <h5>Your last task: *last task*</h5>
                                </div>
                            </Col>
                            <Col xs={1}>
                            <Button href="Taskchoose" className="btn btn-light">{'>'}</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col xs={1} className="fake-cards-task fake-lb"></Col>
                    <Col xs={5} className="cards-task">
                        <Row>
                            <Col xs={11}>
                                <h3>Forensic</h3>
                                <ProgressBar  now={33} label="33%" className="bg-lb" />

                                <div className="text-right">
                                    <h5>Your last task: *last task*</h5>
                                </div>
                            </Col>
                               <Col xs={1}>
                            <Button href="Taskchoose" className="btn btn-light">{'>'}</Button>
                            </Col>
                        </Row>


                        <Col xs={6}></Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Task
