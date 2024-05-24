import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, Card } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useContext, useState } from "react"
import { UserContext } from "../context/user.context"

function NewsCard(props) {
    return (
        <Col sm="12">
            <Card className="mb-3" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <Row className="h-100 g-0">
                    <Col md="4">
                        <Image fluid rounded className="bg-black w-100 h-100" />
                    </Col>
                    <Col md="8">
                        <Card.Body>
                            <Card.Title className="fs-4">
                                Lorem ipsum dolor sit amet
                            </Card.Title>
                            <Card.Text>
                                Lorem ipsum dolor sit amet consectetur. Orci nunc ut est diam nulla magna. Eu lacinia tempus purus justo. Id id nibh nullam scelerisque sed. Vestibulum lorem ut eu volutpat ac mi potenti. Parturient diam nunc turpis sapien ac. Erat diam at adipiscing velit aliquet leo id facilisi. Laoreet aenean amet at non neque faucibus amet. Sit euismod sociis et ac. Tortor id pharetra vitae luctus lorem eu feugiat eleifend.
                                Penatibus sed amet commodo commodo tincidunt aliquam tincidunt. Pulvinar tortor turpis commodo posuere pellentesque egestas dictum. Viverra quam nam et aenean lacinia velit pharetra mattis. Porta felis aliquam accumsan tempor. Felis venenatis eu convallis risus gravida.
                            </Card.Text>
                            <Button type="button" variant="outline-secondary">Read</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Col>
    )
}

function Home() {
    const userContext = useContext(UserContext)
    return (
        <>
            <Row className="mt-5" />
            <Row className="justify-content-end align-items-center">
                {!userContext.loggedIn &&
                    <Col xs="auto">
                        <Card style={{ width: '44rem', borderRadius: "20px", overflow: "hidden" }}>
                            <Card.Body>
                                <Card.Title>Introduction</Card.Title>
                                <Card.Text>
                                    Welcome to the site where you can learn both basic and more sophisticated information about information security.<br />You will also be provided with videos, after watching them you can try to fix the vulnerability yourself, or you will be asked a couple of questions so that you can verify the information received.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                }

                <Col xs="auto">
                    <Card style={{ width: '22rem', borderRadius: "20px", overflow: "hidden" }}>
                        <Card.Body>
                            <Card.Title>Long time no see</Card.Title>
                            <Card.Text>
                                Lets go
                            </Card.Text>
                            <Button variant="primary">Go to last task</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5" />
            <Row>
                <NewsCard />
                <NewsCard />
                <NewsCard />
                <NewsCard />
                <NewsCard />
                <NewsCard />
            </Row>
            <Row className="mt-5" />
            <Row className="mt-5" />
            <Row className="mt-5" />
        </>
    )
}

export default Home