import { Container, Row, Col, ProgressBar, Navbar } from "react-bootstrap"
import { HomeFontIcon, HomeSVGIcon } from "@react-md/material-icons"

import './Home.css'

function Home() {
    let user = "eblan"
    return (
        <>
            <Container id="main" fluid="md" className="mt-5">
                <Row>
                    <Col className="align-items-left">
                        <h1>hello, {user}</h1>
                    </Col>
                    <Col className="align-self-center">
                        <Row className="align-items-center justify-content-center">
                            <Col className="col-8">
                                <ProgressBar now={60} />
                            </Col>
                            <Col className="col-4">
                                <h5 className="m-0">1000px</h5>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container fluid="sm" className="fixed-bottom text-center navigation">
                <Row className="justify-content-md-center">
                    <Col className="navchild">
                        <HomeSVGIcon />
                        <p className="m-0">text</p>
                    </Col>
                    <Col className="navchild">
                        <HomeSVGIcon />
                        <p className="m-0">text</p>
                    </Col>
                    <Col className="navchild">
                        <HomeSVGIcon />
                        <p className="m-0">text</p>
                    </Col>
                    <Col className="navchild">
                        <HomeSVGIcon />
                        <p className="m-0">text</p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home