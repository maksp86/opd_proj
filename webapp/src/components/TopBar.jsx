import { Container, Row, Col, ProgressBar, Button } from "react-bootstrap"
import { CaretLeftFill, CursorFill, WrenchAdjustable } from "react-bootstrap-icons"

import { useMatch, useNavigate } from "react-router-dom"
import { UserContext } from "../context/user.context"
import { useContext } from "react"
import OnlyLogined from "./OnlyLogined"
import { ApiContext } from "../context/api.context"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import IsAdmin from "../components/IsAdmin"

function ShowForPath(props) {
    const isMatch = useMatch(props.path)
    if (isMatch)
        return props.children
    return <></>
}

function UserProgressBar(props) {
    return (
        <Col xs="11" md="5" lg="6">
            <Row className="align-items-center my-2">
                <Col>
                    <ProgressBar variant="secondary" min={0} max={1000} now={props.userContext.computedXp % 1000} />
                </Col>
                <Col xs="auto">
                    <h6 className="m-0 text-end">{props.userContext.computedXp} xp</h6>
                </Col>
            </Row>
        </Col>
    )
}

function TopBar() {
    const navigate = useNavigate()
    const userContext = useContext(UserContext)
    const breadCrumbscontext = useContext(BreadcrumbsContext)
    const api = useContext(ApiContext)

    async function processLogout() {
        await api.request("/user/logout")
        userContext.logout();
        navigate("/login")
    }

    function onTaskBack() {
        const pathBase = "/" + (breadCrumbscontext.lastTask.parent.isLearning ? "learning" : "tasks")
        navigate(pathBase + "/" + breadCrumbscontext.lastTask.parent.shortname,
            { state: { item: breadCrumbscontext.lastTask.parent } })
    }

    function onCategoryBack() {
        const pathBase = "/" + (breadCrumbscontext.lastCategory.isLearning ? "learning" : "tasks")
        navigate(pathBase)
    }

    function ForCategoriesPage() {
        return (
            <>
                <Col md="6" className="align-items-left">
                    <Row>
                        <Col xs="auto">
                            <Button variant="" onClick={() => onCategoryBack()}><CaretLeftFill /></Button>
                        </Col>
                        <Col>
                            <h2 className="m-0 text-truncate">{breadCrumbscontext.lastCategory && breadCrumbscontext.lastCategory.title}</h2>
                        </Col>
                    </Row>
                </Col>
                <UserProgressBar userContext={userContext} />
            </>
        )
    }

    function LogoAndName() {
        return (
            <>
                <Col xs="auto" className="align-items-left">
                    <CursorFill className="logoicon" size={30} />
                </Col>
                <Col className="align-items-left">
                    <h2 className="m-0">CTF Navigator</h2>
                </Col>
            </>
        )
    }

    return (
        <Container id="topbar" fluid="lg" className="py-4 px-3">
            <Row className="align-items-center justify-content-center">
                <OnlyLogined>
                    <ShowForPath path={"/"}>
                        <Col md="6" className="align-items-left">
                            <h2 className="m-0 text-truncate">Hello, {userContext.user.username}</h2>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/account"}>
                        <LogoAndName />
                        <IsAdmin>
                            <Col xs="auto">
                                <Button
                                    variant=""
                                    onClick={() => navigate("/manage")}>
                                    <WrenchAdjustable />
                                </Button>
                            </Col>
                        </IsAdmin>
                        <Col xs="auto">
                            <Row className="justify-content-end">
                                <Col xs="auto">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={processLogout}>Logout</Button>
                                </Col>
                            </Row>
                        </Col>
                    </ShowForPath>

                    <ShowForPath path={"/tasks"}>
                        <Col md="6" className="align-items-left">
                            <h2 className="m-0">Task categories</h2>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/learning"}>
                        <Col md="6" className="align-items-left">
                            <h2 className="m-0">Learning categories</h2>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/learning/:id"}>
                        <ForCategoriesPage />
                    </ShowForPath>

                    <ShowForPath path={"/tasks/:id"}>
                        <ForCategoriesPage />
                    </ShowForPath>

                    <ShowForPath path={"/task/:id"}>
                        <Col md="6" className="align-items-left">
                            <Row>
                                <Col xs="auto">
                                    <Button variant="" onClick={() => onTaskBack()}><CaretLeftFill /></Button>
                                </Col>
                                <Col>
                                    <h2 className="m-0">Task</h2>
                                </Col>
                            </Row>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/manage"}>
                        <LogoAndName />
                    </ShowForPath>
                </OnlyLogined>
                <OnlyLogined inverse>
                    <ShowForPath path={"/"}>
                        <LogoAndName />
                    </ShowForPath>
                </OnlyLogined>
            </Row>
        </Container>
    )
}

export default TopBar