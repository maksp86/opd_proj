import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, Card } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/user.context"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { useNavigate } from "react-router-dom"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import { ApiContext } from "../context/api.context"
import TimeAgo from "react-timeago"

function NewsCard(props) {
    return (
        <Col sm="12">
            <Card className="mb-3" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <Row className="h-100 g-0">
                    <Col md="4">
                        <Image fluid rounded className="bg-black w-100 h-100" src={props.item.img || ""} />
                    </Col>
                    <Col md="8">
                        <Card.Body>
                            <Card.Title className="fs-4">
                                {props.item.title}
                            </Card.Title>
                            <Card.Subtitle>
                                <p>posted <TimeAgo date={props.item.date} /></p>
                            </Card.Subtitle>
                            <Card.Text>
                                {props.item.summary}
                            </Card.Text>
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={() => window.open(props.item.link, "_blank")}
                            >Read</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Col>
    )
}

function Home() {
    const navigate = useNavigate()
    const api = useContext(ApiContext)
    const breadCrumbscontext = useContext(BreadcrumbsContext)
    const userContext = useContext(UserContext)
    const pageTitle = usePageTitle()
    const [news, setNews] = useState([])

    async function LoadNews() {
        const result = await api.request("/news/get")
        if (result)
            setNews(result.data.value)
    }

    useEffect(() => {
        pageTitle.set("Home")
        LoadNews()
    }, [])
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

                {!!breadCrumbscontext.lastTask && <Col xs="auto">
                    <Card style={{ width: '22rem', borderRadius: "20px", overflow: "hidden" }}>
                        <Card.Body>
                            <Card.Title>Long time no see</Card.Title>
                            <Card.Text>
                                Lets go
                            </Card.Text>
                            <Button onClick={() => navigate("/task/" + breadCrumbscontext.lastTask._id)} variant="primary">Go to last task</Button>
                        </Card.Body>
                    </Card>
                </Col>}
            </Row>
            <Row className="mt-5" />
            <Row>
                {news.map((item) => <NewsCard key={item.link} item={item} />)}
            </Row>
            <Row className="mt-5" />
            <Row className="mt-5" />
        </>
    )
}

export default Home