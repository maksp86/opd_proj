import { Container, Row, Col, ProgressBar, Button } from "react-bootstrap"
import { CursorFill } from "react-bootstrap-icons"

import { useMatch, useNavigate } from "react-router-dom"
import { UserContext } from "../context/user.context"
import { useContext } from "react"
import OnlyLogined from "./OnlyLogined"
import { ApiContext } from "../context/api.context"

function ShowForPath(props) {
    if (useMatch(props.path))
        return props.children
    return <></>
}

function UserProgressBar(props) {
    return (
        <Col>
            <Row className="align-items-center">
                <Col>
                    <ProgressBar variant="secondary" min={0} max={1000} now={props.userContext.computedXp % 1000} />
                </Col>
                <Col xs="auto">
                    <h5 className="m-0 text-end">{props.userContext.computedXp} xp</h5>
                </Col>
            </Row>
        </Col>
    )
}

function TopBar(props) {
    const navigate = useNavigate()
    const userContext = useContext(UserContext)
    const api = useContext(ApiContext)

    async function processLogout()
    {
        await api.request("/user/logout")
        userContext.logout();
        navigate("/login")
    }

    return (
        <Container id="topbar" fluid="sm" className="py-4 px-3 mb-3 user-select-none">
            <Row className="align-items-center">
                <OnlyLogined>
                    <ShowForPath path={"/"}>
                        <Col md="6" className="align-items-left">
                            <h1 className="m-0">hello, {userContext.user.username}</h1>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/account"}>
                        <Col xs="auto" className="align-items-left">
                            <CursorFill size={30} />
                        </Col>
                        <Col className="align-items-left">
                            <h1 className="m-0">CTF Navigator</h1>
                        </Col>
                        <Col>
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

                    <ShowForPath path={"/tasks*"}>
                        <Col md="6" className="align-items-left">
                            <h1 className="m-0">Task categories</h1>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/learning*"}>
                        <Col md="6" className="align-items-left">
                            <h1 className="m-0">Learning categories</h1>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>
                </OnlyLogined>
            </Row>
        </Container>
    )
}

export default TopBar