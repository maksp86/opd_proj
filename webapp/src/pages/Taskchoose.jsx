import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import './ESCstyle.scss';

function Taskchoose() {
    return (
        <>              
            <Container  className="category">
                <Row className="name-tasks fotstyp">
                    <Col>
                        <h2 className="text-center text-uppercase mb-5">Easy tasks</h2>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">First Task</h5>
                        </Button></Col>
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">Second Task</h5>
                        </Button></Col>
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">Third Task</h5>
                        </Button></Col>
                </Row>

                <Row className="name-tasks otstyp">
                    <Col>
                        <h2 className="text-center text-uppercase mb-5">Medium tasks</h2>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">First Task</h5>
                        </Button></Col>
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">Second Task</h5>
                        </Button></Col>
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">Third Task</h5>
                        </Button></Col>
                </Row>

                <Row className="name-tasks otstyp">
                    <Col>
                        <h2 className="text-center text-uppercase mb-5">Hard task</h2>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">First Task</h5>
                        </Button></Col>
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">Second Task</h5>
                        </Button></Col>
                    <Col xs><Button href="Thistask" className="btn-primary col task-block" role="button">
                            <h5 className="text-center">Third Task</h5>
                        </Button></Col>
                </Row>

            </Container>
        </>
    )
}

export default Taskchoose
