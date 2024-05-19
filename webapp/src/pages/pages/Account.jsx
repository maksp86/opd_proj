import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import './accstyle.scss';

function account() {
    return (
        <>              
            <Container  className="acc">
                <Row className="align-items-center">
                    <Col xs={2}>
                        <Image src="user-avatar-url" alt="User Avatar" className="img-fluid rounded-circle" />
                    </Col>
                    <Col xs={2}>
                        <h4>Nickname</h4>
                        <h5>noy nickname</h5>
                    </Col>
                    <Col xs={4} className="text-right">
                        <Button variant="outline-secondary">Edit</Button>
                    </Col>
                </Row>
            </Container>

            <Container className="mb-5">
                <Row className="prog">
                    <h5 className="text-right">Level *n*</h5>

                    <Col md={8}>
                        <ProgressBar animated variant="primary" now={40} label="" />
                    </Col>
                    
                    <Col md={3} className="mt-3">
                        <h5 className="text-right">Level *n*</h5>
                    </Col>
                </Row>
            </Container>


            <Container className="news mt-5">
                <Row className="align-items-center">
                    <h3 className="text-right">Last solved task</h3>

                    <Col className="col text-news">
                        <h4 className="text-right">*Name task* - *name category*</h4>

                        <h4 className="text-right">*Name task* - *name category*</h4>

                        <h4 className="text-right">*Name task* - *name category*</h4>

                        <h4 className="text-right">*Name task* - *name category*</h4>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default account
