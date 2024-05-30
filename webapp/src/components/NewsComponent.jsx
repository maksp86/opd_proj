import { Row, Col, Button, Card, Spinner, Badge } from "react-bootstrap"
import { Globe } from "react-bootstrap-icons"
import { ApiContext } from "../context/api.context"
import TimeAgo from "react-timeago"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/user.context"

function NewsCard(props) {
    return (
        <Col xs="12" xl="6">
            <Card className="mb-3" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <Row className="g-0">
                    <Col className="d-grid" md="5">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url("${props.item.img || ''}")`,
                                backgroundPosition: "center",
                                backgroundColor: "black"
                            }}
                        ></div>
                    </Col>
                    <Col md="7">
                        <Card.Body>
                            <Card.Title className="fs-5">
                                {props.item.title}
                            </Card.Title>
                            <Card.Subtitle
                                className="mt-2">
                                <p>posted <TimeAgo date={props.item.date} /> {props.item.external &&
                                    <Badge
                                        bg="secondary"
                                        title="This post was taken from external source">
                                        <Globe />
                                    </Badge>
                                }</p>
                            </Card.Subtitle>
                            <Card.Text
                                className=""
                                style={{
                                    maxHeight: "15vh",
                                    wordBreak: "break-word",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    WebkitLineClamp: "4",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical"
                                }}>
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

function NewsComponent() {
    const api = useContext(ApiContext)
    const userContext = useContext(UserContext)
    const [news, setNews] = useState([])

    if (!userContext.loggedIn) return null


    async function LoadNews() {
        const result = await api.request("/news/get")
        if (result)
            setNews(result.data.value)
    }

    useEffect(() => {
        if (userContext.loggedIn) LoadNews()
    }, [])

    return (
        <Row>
            <Col>
                <Row className="mb-2">
                    <Col>
                        <h3>Latest cybersecurity news</h3>
                    </Col>
                </Row>
                <Row className="justify-content-center gx-2">
                    {news.map((item) => <NewsCard key={item.link} item={item} />)}
                    {news.length == 0 && <Spinner />}
                </Row>
            </Col>
        </Row>
    )
}

export default NewsComponent