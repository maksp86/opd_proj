import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, FormControl, InputGroup } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import './tTstyle.scss';

function Thistask() {
    return (
        <>
            <Container className="task">
                <Row>
                    <Col md={7} className="task-text">
                        <h2 className="text-left h2">*Name tasks*</h2>
                        <h4 className="text-left h4">*What you need to do*</h4>
                        <Button variant="outline-secondary" className="a" href="task-file" download="name-task.zip">Download file</Button>
                    </Col>

                    <Col md={4}>
                        <Row className="otstyp">
                            <InputGroup className="mb-3 answer">
                                <FormControl placeholder="Write flag" aria-label="Write flag" aria-describedby="button-addon2" />
                                <Button variant="outline-secondary" id="button-addon2" type="button">Submit</Button>
                            </InputGroup>
                        </Row>
        
                        <h4 className="text-right mb-3">Возможно вам понравиться!!!</h4>

                        <Row>
                            <Col className="all-info">
                                <h5 className="text-right new-info p-1">Some interesting article or video <Button href="Learningchoose" className="btn btn-light" >></Button></h5>
                                <h5 className="text-right new-info p-1">Some interesting article or video <Button href="Learningchoose" className="btn btn-light" >></Button></h5>
                                <h5 className="text-right new-info p-1">Some interesting article or video <Button href="Learningchoose" className="btn btn-light" >></Button></h5>
                                <h5 className="text-center new-info p-3">Learn something NEW!!!</h5>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Thistask
