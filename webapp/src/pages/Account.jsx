import { useContext, useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { UserContext } from "../context/user.context";
import { ApiContext } from "../context/api.context";
import { ModalContext } from "../context/modal.context";
import UserEditModal from "./modals/UserEditModal";
import AvatarImage from "../components/AvatarImage";
import LastTasks from "../components/LastTasks";
import { CameraFill } from "react-bootstrap-icons";

function Account() {
    const pageTitle = usePageTitle();
    const userContext = useContext(UserContext)
    const api = useContext(ApiContext)
    const modal = useContext(ModalContext)

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
            <Row className="justify-content-center">
                <Col sm="12" md="auto" className="align-self-center d-grid">
                    <div
                        className="account-avatar-image-wrapper"
                        onClick={() => modal.show(<UserEditModal isPhotoUpload={true} />, false)}>
                        <AvatarImage
                            className="account-avatar-image mx-auto"
                            avatar={userContext.user.image} />
                        <CameraFill className="account-avatar-image-icon" />
                    </div>
                </Col>
                <Col xs="12" sm="8" className="d-grid">
                    <div className="my-auto account-bio-container">
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
                        onClick={() => modal.show(<UserEditModal />, false)}>
                        Edit
                    </Button>
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