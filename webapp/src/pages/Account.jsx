import { useContext, useEffect, useState } from "react";
import { Row, Col, ProgressBar, Button, Image, ListGroup, Badge } from "react-bootstrap"
import TimeAgo from "react-timeago"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../context/api.context";
import { ModalContext } from "../context/modal.context";
import UserEditModal from "./modals/UserEditModal";
import AvatarImage from "../components/AvatarImage";

function Account() {
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

    function LastTasks(props) {
        if (props.taskStats && props.taskStats.length > 0)
            return (
                <ListGroup as="ol">
                    {
                        props.taskStats.map((submit) =>
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
            )
        else
            return (
                <ListGroup as="ol">
                    <ListGroup.Item className="text-center">
                        <h6 className="my-2">No solved tasks</h6>
                    </ListGroup.Item>
                </ListGroup>
            )
    }

    return (
        <>
            <Row className="justify-content-center">
                <Col xs="auto" sm="auto" className="align-self-center">
                    <AvatarImage roundedCircle
                        style={{
                            maxHeight: "120px",
                            maxWidth: "120px",
                            width: "8vw",
                            height: "8vw",
                            minHeight: "80px",
                            minWidth: "80px"
                        }}
                        avatar={userContext.user.image} />
                </Col>
                <Col xs="9" sm="8" className="d-grid">
                    <div className="my-auto">
                        <Row>
                            <h2>{userContext.user.name}</h2>
                        </Row>
                        <Row>
                            <p className="fw-thin">{userContext.user.bio || "No bio right now"}</p>
                        </Row>
                    </div>
                </Col>
                <Col xs="6" md="auto" className="d-grid align-self-center">
                    <Button
                        variant="outline-dark"
                        onClick={() => modal.show(<UserEditModal />, false)}>Edit</Button>
                </Col>
            </Row>
            <Row className="mt-5">
                <Row><h4>Progress</h4></Row>
                <Row className="align-items-center">
                    <Col>
                        <div
                            style={{ backgroundColor: "var(--bs-success-bg-subtle)" }}
                            className="progress">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                    backgroundColor: "var(--bs-success)",
                                    width: (userContext.computedXp % 1000 / 10 || 0) + "%",
                                }}
                                aria-valuenow={userContext.computedXp % 1000 / 10 || 0}
                                aria-valuemin="0"
                                aria-valuemax="100">
                            </div>
                        </div>
                    </Col>
                    <Col xs="auto">
                        <h5 className="m-0 text-end">{userContext.computedXp}xp</h5>
                    </Col>
                </Row>
            </Row>
            <Row className="mt-5">
                <h4>Last solved tasks</h4>
                <Col md="12">
                    <LastTasks taskStats={taskStats} />
                </Col>
            </Row>
        </>
    )
}

export default Account;