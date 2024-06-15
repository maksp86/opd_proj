import { Row, Col, Button, Card } from "react-bootstrap"
import { useContext, useEffect } from "react"
import { UserContext } from "../context/user.context"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { useNavigate } from "react-router-dom"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import NewsComponent from "../components/NewsComponent"
import { ServerInfoContext } from "../context/serverinfo.context"

function Home() {
    const navigate = useNavigate()
    const breadCrumbscontext = useContext(BreadcrumbsContext)
    const serverinfo = useContext(ServerInfoContext)
    const userContext = useContext(UserContext)
    const pageTitle = usePageTitle()

    useEffect(() => {
        pageTitle.set("Home")
    }, [])

    return (
        <>
            <Row className="justify-content-evenly align-items-center my-2">
                {!userContext.loggedIn &&
                    <Col xs="12" lg="6">
                        <Card style={{ borderRadius: "20px", overflow: "hidden" }}>
                            <Card.Body>
                                <Card.Title>Introduction</Card.Title>
                                <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                                    {serverinfo.serverInfo.introduction}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                }

                {!!breadCrumbscontext.lastTask && <Col xs="10" md="6" lg="4">
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
        </>
    )
}

export default Home