import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, ProgressBar, Button, Image, ListGroup, Badge } from "react-bootstrap"
import TimeAgo from "react-timeago"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../context/api.context";
import { ModalContext } from "../context/modal.context";
import UserEditModal from "./modals/UserEditModal";

function Account(props) {
    const pageTitle = usePageTitle();
    const userContext = useContext(UserContext)
    const api = useContext(ApiContext)
    const modal = useContext(ModalContext)
    const navigate = useNavigate();

    const [taskStats, setTasksStats] = useState([]);

    async function fetchUserSubmits() {
        const result = await api.request("/submit/list?id=" + userContext.user._id)
        if (result)
            setTasksStats(result.data.value)
    }

    useEffect(() => {
        pageTitle.set("Account")
        fetchUserSubmits()
    }, []);

    useEffect(() => {
        if (!modal.isOpen) {
            userContext.setUpdateRequest(true)
        }
    }, [modal.isOpen])

    return (
        <>
            <Row className="justify-content-center mt-5">
                <Col xs="auto" className="align-self-center">
                    <Image roundedCircle
                        style={{ backgroundColor: "#000", width: "10vh", height: "10vh" }} src={userContext.user.image && ("/api/attachments/get?id=" + userContext.user.image)} />
                </Col>
                <Col xs="9" sm md="8">
                    <Row>
                        <h1>{userContext.user.name}</h1>
                    </Row>
                    <Row>
                        <p className="fw-thin">{userContext.user.bio || "No bio right now"}</p>
                    </Row>
                </Col>
                <Col xs="6" sm="auto" className="d-grid align-self-center">
                    <Button
                        variant="outline-dark"
                        onClick={() => modal.show(<UserEditModal />, false)}>Edit</Button>
                </Col>
            </Row>
            <Row className="mt-5">
                <Row><h4>Progress</h4></Row>
                <Row className="align-items-center">
                    <Col>
                        <ProgressBar variant="success" now={userContext.computedXp % 1000} min={0} max={1000} />
                    </Col>
                    <Col xs="auto">
                        <h5 className="m-0 text-end">{userContext.computedXp}xp</h5>
                    </Col>
                </Row>
            </Row>
            <Row className="mt-5">
                <h3>Last solved tasks</h3>
                <Col md="12">
                    <ListGroup as="ol">
                        {
                            !!taskStats && taskStats.map((submit) =>
                                <ListGroup.Item
                                    action
                                    key={submit._id}
                                    as="li"
                                    onClick={() => navigate("/task/" + submit.task._id)}
                                    className="d-flex justify-content-between align-items-center user-select-none">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-semibold fs-5">{submit.task.title}</div>
                                        <TimeAgo date={submit.createdAt} />
                                    </div>
                                    <Badge bg="secondary fs-6 fw-medium" pill>
                                        {submit.task.difficulty.value} xp
                                    </Badge>
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </Col>
            </Row>
        </>
    )
}

export default Account;