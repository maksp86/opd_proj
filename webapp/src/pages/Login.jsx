import { useState } from "react";
import { Row, Col, FloatingLabel, Form, Button, Container } from "react-bootstrap";


function LoginPage() {
    const [registerMode, setRegisterMode] = useState(false)

    return (
        <>
            <Container style={{ maxWidth: "40%" }}>
                <Row>
                    <Col>
                        <h2 className="mx-2 my-4">Login</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Email address"
                            className="mb-3"
                        >
                            <Form.Control type="email" placeholder="name@example.com" />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                            <Form.Control type="password" placeholder="Password" />
                        </FloatingLabel>
                        {
                            registerMode &&
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control type="password" placeholder="Password" />
                            </FloatingLabel>
                        }
                    </Col>
                </Row>
                <Row className="mt-3 px-3 justify-content-end align-items-center">
                    <Col className="align-items-center">
                        {!registerMode &&
                            <a href="#register" onClick={() => setRegisterMode(true)}>Want to register?</a>
                        }
                    </Col>
                    <Col xs="4" className="d-grid">
                        <Button variant="outline-primary" type="button">
                            {registerMode ? "Register" : "Login"}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default LoginPage;