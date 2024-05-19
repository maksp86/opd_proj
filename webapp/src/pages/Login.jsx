import { useState } from "react";
import { Row, Col, FloatingLabel, Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function LoginPage() {
    const [registerMode, setRegisterMode] = useState(false)
    const navigate = useNavigate()

    return (
        <>
            <Container style={{ maxWidth: "50%" }}>
                <Row>
                    <Col>
                        <h2 className="mx-2 my-4">{registerMode ? "Register account" : "Login"}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="usernameInput"
                            label="Username"
                            className="mb-3">
                            <Form.Control type="username" placeholder="user" />
                        </FloatingLabel>
                        {
                            registerMode &&
                            <FloatingLabel controlId="nameInput" label="Name" className="mb-3">
                                <Form.Control type="name" placeholder="Ivan Ivanov" />
                            </FloatingLabel>
                        }
                        <FloatingLabel controlId="passwordInput" label="Password" className="mb-3">
                            <Form.Control type="password" placeholder="Password" />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mt-3 px-3 justify-content-end align-items-center">
                    <Col className="align-items-center">
                        {!registerMode &&
                            <a href="#register" onClick={() => setRegisterMode(true)}>Want to register?</a>
                        }
                    </Col>
                    <Col xs="4" className="d-grid">
                        <Button variant="outline-primary" type="button"
                        onClick={() => navigate("/")}>
                            {registerMode ? "Register" : "Login"}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default LoginPage;