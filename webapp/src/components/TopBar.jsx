import { Container, Row, Col, ProgressBar, Button } from "react-bootstrap"
import { CursorFill } from "react-bootstrap-icons"

import { useMatch } from "react-router-dom"

import "./TopBar.css"

function ShowForPath(props) {
    if (useMatch(props.path))
        return props.children
    return <></>
}

function TopBar(props) {
    return (
        <Container id="topbar" fluid="sm" className="mt-3 mb-3">
            <Row className="align-items-center">
                <ShowForPath path={"/"}>
                    <Col md="6" className="align-items-left">
                        <h1 className="m-0">hello, {props.user.username}</h1>
                    </Col>
                    <Col>
                        <Row className="align-items-center">
                            <Col>
                                <ProgressBar variant="success" now={60} />
                            </Col>
                            <Col xs="auto">
                                <h5 className="m-0 text-end">{props.user.xp}xp</h5>
                            </Col>
                        </Row>
                    </Col>
                </ShowForPath>

                <ShowForPath path={"/account"}>
                    <Col xs="auto" className="align-items-left">
                        <CursorFill size={30} />
                    </Col>
                    <Col className="align-items-left">
                        <h1 className="m-0">CTF Navigator</h1>
                    </Col>
                    <Col>
                        <Row className="justify-content-end">
                            <Col xs="auto">
                                <Button variant="secondary" type="button">Logoff</Button>
                            </Col>
                        </Row>
                    </Col>
                </ShowForPath>
            </Row>
        </Container>
    )
}

export default TopBar