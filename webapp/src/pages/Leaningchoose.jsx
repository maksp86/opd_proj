import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import './ESCstyle.scss';

function Leaningchoose() {
    return (
        <>              
            <Container  className="category">
                <Row className="name-tasks fotstyp mb-5">
                    <Col>
                        <h3 className="text-center text-uppercase mb-5">What you want to learn today?</h3>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col className="h45-g">
                        <Row>
                            <Col xs={11}>
                                <h4 className="text-right pt-3 mb-3">*Something new*</h4>  
                                <h5 className="text-right">*Something new*</h5>
                            </Col>
                            <Col xs={1}> <Button href="Thislearning" className="btn btn-gray">{'>'}</Button>  </Col>
                        </Row>
                    </Col>

                    <Col className="h45">
                        <Row>
                            <Col xs={11}>
                                <h4 className="text-right pt-3 mb-3">*Something new*</h4>  
                                <h5 className="text-right">*Something new*</h5>
                            </Col>
                            <Col xs={1}> <Button href="Thislearning" className="btn btn-light">{'>'}</Button>  </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col className="h45">
                        <Row>
                            <Col xs={11}>
                                <h4 className="text-right pt-3 mb-3">*Something new*</h4>  
                                <h5 className="text-right">*Something new*</h5>
                            </Col>
                            <Col xs={1}> <Button href="Thislearning" className="btn btn-light">{'>'}</Button>  </Col>
                        </Row>
                    </Col>

                    <Col className="h45-g">
                        <Row>
                            <Col xs={11}>
                                <h4 className="text-right pt-3 mb-3">*Something new*</h4>  
                                <h5 className="text-right">*Something new*</h5>
                            </Col>
                            <Col xs={1}> <Button href="Thislearning" className="btn btn-gray">{'>'}</Button>  </Col>
                        </Row>
                    </Col>
                </Row>


                <Row className="mb-5">
                    <Col className="h45-g">
                        <Row>
                            <Col xs={11}>
                                <h4 className="text-right pt-3 mb-3">*Something new*</h4>  
                                <h5 className="text-right">*Something new*</h5>
                            </Col>
                            <Col xs={1}> <Button href="Thislearning" className="btn btn-gray">{'>'}</Button>  </Col>
                        </Row>
                    </Col>

                    <Col className="h45">
                        <Row>
                            <Col xs={11}>
                                <h4 className="text-right pt-3 mb-3">*Something new*</h4>  
                                <h5 className="text-right">*Something new*</h5>
                            </Col>
                            <Col xs={1}> <Button href="Thislearning" className="btn btn-light">{'>'}</Button>  </Col>
                        </Row>
                    </Col>
                </Row>


            </Container>
        </>
    )
}

export default Leaningchoose
