import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"

// import './Home.scss'
import './Navigation.css'

function NavButton(props) {
    const active = true

    return (
        <Button
            variant="dark"
            className={"navigation-button " + (active ? "navigation-button-active " : "") + props.className}
            onClick={() => navigateTo(props.path)}
        >
            <div className="navigation-selector-holder">
                {props.children}
                <span className="fw-medium">{props.text}</span>
            </div>
        </Button>
    )
}

function Home() {
    let user = "eblan"
    return (
        <>
            <Container id="main" fluid="sm" className="mt-5 my-1">
                <Row>
                    <Col xs="12" md="6" className="align-items-left">
                        <h1>hello, {user}</h1>
                    </Col>
                    <Col className="align-self-center">
                        <Row className="align-items-center">
                            <Col>
                                <ProgressBar now={60} />
                            </Col>
                            <Col xs="auto">
                                <h5 className="m-0 text-end">1000px</h5>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col className="g-2">
                        <div style={{ height: "200px", width: "400px", backgroundColor: "black" }}></div>
                    </Col>
                    <Col className="g-2">
                        <div style={{ height: "200px", width: "400px", backgroundColor: "black" }}></div>
                    </Col>
                    <Col className="g-2">
                        <div style={{ height: "200px", width: "400px", backgroundColor: "black" }}></div>
                    </Col>
                    <Col className="g-2">
                        <div style={{ height: "200px", width: "400px", backgroundColor: "black" }}></div>
                    </Col>
                    <Col className="g-2">
                        <div style={{ height: "200px", width: "400px", backgroundColor: "black" }}></div>
                    </Col>
                    <Col className="g-2">
                        <div style={{ height: "200px", width: "400px", backgroundColor: "black" }}></div>
                    </Col>
                </Row>
            </Container>
            <Navbar
                bg="dark"
                variant="dark"
                fixed="bottom"
                className="navigation p-0 mx-auto">

                <ButtonGroup className="navigation-selectors">
                    <NavButton path="/" exact={true} text="1">
                        <HouseDoor size={30} />
                    </NavButton>

                    <NavButton path="/2" text="2">
                        <HouseDoor size={30} />
                    </NavButton>

                    <NavButton path="/3" text="3">
                        <HouseDoor size={30} />
                    </NavButton>

                    <NavButton path="/4" text="4">
                        <Person size={30} />
                    </NavButton>
                </ButtonGroup>
            </Navbar >
        </>
    )
}

export default Home