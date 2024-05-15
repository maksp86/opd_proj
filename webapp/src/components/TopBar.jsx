import { Container, Row, Col, ProgressBar, Button } from "react-bootstrap"

import "./TopBar.css"

function TopBar(props) {
    return (
        <Container id="topbar" fluid="sm" className="mt-5 mb-3">
            <Row className="align-items-center">
                <Col md="6" className="align-items-left">
                    <h1 className="m-0">hello, {props.user.username}</h1>
                </Col>
                <Col className="align-self-center">
                    <Row className="align-items-center">
                        <Col>
                            <ProgressBar variant="success" now={60} />
                        </Col>
                        <Col xs="auto">
                            <h5 className="m-0 text-end">{props.user.xp}xp</h5>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default TopBar