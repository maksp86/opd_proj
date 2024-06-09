import { useContext, useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../context/api.context";
import AvatarImage from "../components/AvatarImage";
import LastTasks from "../components/LastTasks";
import { UserContext } from "../context/user.context";

function UserViewPage() {
    const pageTitle = usePageTitle();
    const api = useContext(ApiContext)
    const userContext = useContext(UserContext)
    const params = useParams()
    const navigate = useNavigate()

    const [taskStats, setTasksStats] = useState([]);
    const [loadedUser, setLoadedUser] = useState(undefined);

    async function fetchUserSubmits() {
        const result = await api.request("/submit/list?id=" + params.id)
        if (result)
            setTasksStats(result.data.value)
    }

    async function fetchUserInfo() {
        const result = await api.request("/stats/user?id=" + params.id)
        if (result) {
            setLoadedUser(result.data.value)
            pageTitle.set(result.data.value.foundUser.name)
        }
    }

    useEffect(() => {
        pageTitle.set("User")
        if (params.id) {
            if (params.id === userContext.user._id)
                navigate("/account")
            else {
                fetchUserInfo()
                fetchUserSubmits()
            }
        }
    }, []);

    if (!!loadedUser)
        return (
            <>
                <Row className="justify-content-center">
                    <Col xs="12" sm="auto" className="align-self-center d-grid">
                        <AvatarImage className="account-avatar-image mx-auto"
                            avatar={loadedUser.foundUser.image} />
                    </Col>
                    <Col xs="12" sm="8" className="d-grid">
                        <div className="my-auto account-bio-container">
                            <Row>
                                <h2>{loadedUser.foundUser.name}</h2>
                            </Row>
                            <Row>
                                <p className="fw-thin">{loadedUser.foundUser.bio || "No bio right now"}</p>
                            </Row>
                        </div>
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
                                        width: (loadedUser.rating % 1000 / 10 || 0) + "%",
                                    }}
                                    aria-valuenow={loadedUser.rating % 1000 / 10 || 0}
                                    aria-valuemin="0"
                                    aria-valuemax="100">
                                </div>
                            </div>
                        </Col>
                        <Col xs="auto">
                            <h5 className="m-0 text-end">{loadedUser.rating}xp</h5>
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
    else
        return (
            <>
                <Row className="justify-content-center text-center">
                    <h5>Loading...</h5>
                    <Spinner />
                </Row>
            </>)
}

export default UserViewPage;