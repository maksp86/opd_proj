import { Container, Row, Col, ProgressBar, Button, Dropdown } from "react-bootstrap"
import { CaretLeftFill, CursorFill, DoorOpenFill, MoonFill, SunFill, ThreeDotsVertical, WrenchAdjustable } from "react-bootstrap-icons"

import { useMatch, useNavigate } from "react-router-dom"
import { UserContext } from "../context/user.context"
import { useContext } from "react"
import OnlyLogined from "./OnlyLogined"
import { ApiContext } from "../context/api.context"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import IsAdmin from "../components/IsAdmin"
import { ThemeContext } from "../context/theme.context"

function ShowForPath(props) {
    const isMatch = useMatch(props.path)
    if (isMatch)
        return props.children
    return <></>
}

function UserProgressBar(props) {
    return (
        <Col xs="3" sm="6" lg="6">
            <Row className="align-items-center">
                <Col className="topbar-progressbar">
                    <div
                        style={{
                            backgroundColor: "var(--bs-success-bg-subtle)"
                        }}
                        className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                                backgroundColor: "var(--bs-success)",
                                width: (props.userContext.computedXp % 1000 / 10 || 0) + "%",
                            }}
                            aria-valuenow={props.userContext.computedXp % 1000 / 10 || 0}
                            aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                </Col>
                <Col xs="12" sm="auto" className="d-grid justify-content-end">
                    <div
                        className="topbar-pxtext-borderbox"
                        style={{
                            "--props-computed-xp": (props.userContext.computedXp % 1000 / 1000 * 360) + "deg"
                        }}>
                        <h6 className="topbar-pxtext m-0">{props.userContext.computedXp} xp</h6>
                    </div>
                </Col>
            </Row >
        </Col >
    )
}

function ThemeSwitchButton(props) {
    const themeContext = useContext(ThemeContext)
    return (
        <Button
            variant=""
            onClick={() => {
                themeContext.set(themeContext.currentTheme == "light" ? "dark" : "light")
            }}>
            {themeContext.currentTheme == "light" ?
                <>
                    <MoonFill />
                    <span>Switch to dark</span>
                </>
                : <>
                    <SunFill />
                    <span>Switch to light</span>
                </>}
        </Button>
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
                <Col xs="1" sm="1" lg="auto">
                    <Button variant="" onClick={() => onCategoryBack()}><CaretLeftFill /></Button>
                </Col>
                <Col xs="7" sm="5">
                    <h2 className="m-0 text-truncate">{breadCrumbscontext.lastCategory && breadCrumbscontext.lastCategory.title}</h2>
                </Col>
                <UserProgressBar userContext={userContext} />
            </>
        )
    }

    function LogoAndName() {
        return (
            <>
                <Col xs="auto" className="align-items-left">
                    <CursorFill
                        className="topbar-logo-icon"
                        style={{
                            height: "calc(1.325rem + 0.9vw)",
                            width: "calc(1.325rem + 0.9vw)",
                            minHeight: "30px",
                            minWidth: "30px",
                        }} />
                </Col>
                <Col xs="auto" sm className="align-items-left">
                    <h2 className="m-0 topbar-logo-text">CTF Navigator</h2>
                </Col>
            </>
        )
    }

    function AccountActions() {
        return (
            <Row className="justify-content-center topbar-accountactions">
                <Col xs="12" sm="auto">
                    <ThemeSwitchButton />
                </Col>
                <IsAdmin>
                    <Col xs="12" sm="auto">
                        <Button
                            variant=""
                            onClick={() => navigate("/manage")}>
                            <WrenchAdjustable />
                            <span>Manage</span>
                        </Button>
                    </Col>
                </IsAdmin>
                <Col xs="12" sm="auto">
                    <Button
                        variant=""
                        type="button"
                        onClick={processLogout}>
                        <DoorOpenFill />
                        <span>Logout</span>
                    </Button>
                </Col>
            </Row>
        )
    }

    return (
        <Container id="topbar" fluid="lg" className="py-4 px-3">
            <Row className="align-items-center justify-content-between">
                <OnlyLogined>
                    <ShowForPath path={"/"}>
                        <Col xs="8" sm="6" className="align-items-left">
                            <h2 className="m-0 text-truncate">Hello, {userContext.user.username}</h2>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/account"}>
                        <LogoAndName />
                        <Col className="topbar-xs-dropdown p-0" xs="auto">
                            <Dropdown as={Container}>
                                <Dropdown.Toggle variant="" className="py-0 px-1">
                                    <ThreeDotsVertical size={25} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <AccountActions />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>

                        <Col className="topbar-accountactions-col" xs="auto">
                            <AccountActions />
                        </Col>
                    </ShowForPath>

                    <ShowForPath path={"/tasks"}>
                        <Col xs="8" sm="6" className="align-items-left">
                            <h2 className="m-0">Task categories</h2>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/learning"}>
                        <Col xs="8" sm="6" className="align-items-left">
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
                        <Col xs="8" sm="6" className="align-items-left">
                            <Row className="align-items-center">
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
                        <Col />
                    </ShowForPath>

                    <ShowForPath path={"/login"}>
                        <LogoAndName />
                        <Col />
                    </ShowForPath>
                </OnlyLogined>
            </Row>
        </Container>
    )
}

export default TopBar