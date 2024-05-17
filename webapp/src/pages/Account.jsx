import { Container, Row, Col, ProgressBar, Button, Image } from "react-bootstrap"

function Account(props) {
    return (
        <>
            <Row className="justify-content-center mt-5">
                <Col xs="auto" className="align-self-center">
                    <Image roundedCircle
                        style={{ backgroundColor: "#000", width: "10vh", height: "10vh" }} />
                </Col>
                <Col xs="9" sm md="8">
                    <Row>
                        <h1>{props.user.name}</h1>
                    </Row>
                    <Row>
                        <p className="fw-thin">{props.user.bio}</p>
                    </Row>
                </Col>
                <Col xs="6" sm="auto" className="d-grid align-self-center">
                    <Button variant="outline-dark" className="">Edit</Button>
                </Col>
            </Row>
            <Row className="mt-5">
                <Row><h4>Level</h4></Row>
                <Row className="align-items-center">
                    <Col>
                        <ProgressBar variant="success" now={60} />
                    </Col>
                    <Col xs="auto">
                        <h5 className="m-0 text-end">{props.user.xp}xp</h5>
                    </Col>
                </Row>
            </Row>
            <Row className="mt-5">
                <h3>Last solved tasks</h3>
                <div>
                    12
                </div>
            </Row>
        </>
    )
}

export default Account;