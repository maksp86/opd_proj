import { Row, Col, Button, Card } from "react-bootstrap"
import { useContext, useEffect } from "react"
import { UserContext } from "../context/user.context"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { useNavigate } from "react-router-dom"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import NewsComponent from "../components/NewsComponent"

function Home() {
    const navigate = useNavigate()
    const breadCrumbscontext = useContext(BreadcrumbsContext)
    const userContext = useContext(UserContext)
    const pageTitle = usePageTitle()

    useEffect(() => {
        pageTitle.set("Home")
    }, [])

    return (
        <>
            <Row className="mt-5" />
            <Row className="justify-content-evenly align-items-center">
                {!userContext.loggedIn &&
                    <Col xs="12" md="6">
                        <Card style={{ borderRadius: "20px", overflow: "hidden" }}>
                            <Card.Body>
                                <Card.Title>Introduction</Card.Title>
                                <Card.Text>
                                    Welcome to the site where you can learn both basic and more sophisticated information about information security.<br />You will also be provided with videos, after watching them you can try to fix the vulnerability yourself, or you will be asked a couple of questions so that you can verify the information received.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                }

                {!!breadCrumbscontext.lastTask && <Col xs="4">
                    <Card style={{ borderRadius: "20px", overflow: "hidden" }}>
                        <Card.Body>
                            <Card.Title>Long time no see</Card.Title>
                            <Card.Text>
                                Lets continue on {breadCrumbscontext.lastTask.title}
                            </Card.Text>
                            <Button onClick={() => navigate("/task/" + breadCrumbscontext.lastTask._id)} variant="primary">Go to last task</Button>
                        </Card.Body>
                    </Card>
                </Col>}
            </Row>
            <NewsComponent />
            <Row className="mt-5" />
            <Row className="mt-5" />
            <Row className="mt-5" />
        </>
    )
}

export default Home