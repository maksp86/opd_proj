import { Container, Row, Col, Button, Dropdown, Overlay, Tooltip } from "react-bootstrap"
import { CaretLeftFill, CursorFill, DoorOpenFill, InfoCircleFill, MoonFill, SunFill, ThreeDotsVertical, WrenchAdjustable } from "react-bootstrap-icons"

import { useLocation, useMatch, useNavigate } from "react-router-dom"
import { UserContext } from "../context/user.context"
import { useContext, useEffect, useRef, useState } from "react"
import OnlyLogined from "./OnlyLogined"
import { ApiContext } from "../context/api.context"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import IsAdmin from "../components/IsAdmin"
import { ThemeContext } from "../context/theme.context"
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { ServerInfoContext } from "../context/serverinfo.context"

function ShowForPath(props) {
    const isMatch = useMatch(props.path)
    if (isMatch)
        return props.children
    return <></>
}

function UserProgressBar(props) {
    const oldComputedXp = useRef(undefined)
    const tooltipElementRef = useRef()
    const popoverRef = useRef()
    const [showPopover, setShowPopover] = useState({ open: false, text: undefined })

    useEffect(() => {
        if (props.userContext.loggedIn) {
            if (props.userContext.computedXp > oldComputedXp.current) {
                // console.log(`UserProgressBar computedXp changed from ${oldComputedXp.current} to ${props.userContext.computedXp}`)
                setShowPopover({ open: true, text: props.userContext.computedXp - oldComputedXp.current })
            }
            oldComputedXp.current = props.userContext.computedXp;
        }
    }, [props.userContext.computedXp])

    const confettiInstance = useRef();

    const onInitHandler = (confetti) => {
        (confettiInstance.current = confetti);
        confettiInstance.current.confetti({ spread: 360, startVelocity: 15, particleCount: 100 });
    }

    return (
        <Col xs="4" sm="6" lg="6">
            <Row className="align-items-center">
                <Col className="topbar-progressbar align-items-center">
                    <div
                        // onClick={() => { props.userContext.setComputedXp(props.userContext.computedXp + 500); }}
                        style={{
                            backgroundColor: "var(--bs-success-bg-subtle)"
                        }}
                        ref={(document.body.clientWidth > 576) ? tooltipElementRef : undefined}
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

                    <Overlay
                        ref={popoverRef}
                        show={showPopover.open}
                        target={tooltipElementRef.current}
                        placement="bottom"
                        onEntering={() => { }}
                        onEntered={() => setTimeout(() => { setShowPopover({ ...showPopover, open: false }) }, 2000)}
                    >
                        <Tooltip>
                            <Fireworks
                                width={300}
                                height={150}
                                style={{ position: "absolute", zIndex: 10001, right: "50%", left: "50%", margin: "auto", transform: "translate(-50%, -50%)" }}
                                globalOptions={{ useWorker: true, resize: true }}
                                onInit={onInitHandler} />
                            +{showPopover.text} xp
                        </Tooltip>
                    </Overlay>
                </Col>
                <Col xs="12" sm="auto" className="d-grid justify-content-end p-0">
                    <div
                        ref={(document.body.clientWidth < 576) ? tooltipElementRef : undefined}
                        className="topbar-pxtext-borderbox"
                        style={{
                            "--props-computed-xp": (props.userContext.computedXp % 1000 / 1000 * 360) + "deg"
                        }}>
                        <h6 className="topbar-pxtext m-0">{props.userContext.computedXp} xp</h6>
                    </div>
                </Col>
            </Row>
        </Col>
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
    const location = useLocation()
    const userContext = useContext(UserContext)
    const breadCrumbscontext = useContext(BreadcrumbsContext)
    const serverInfo = useContext(ServerInfoContext)
    const api = useContext(ApiContext)

    async function processLogout() {
        await api.request("/user/logout")
        userContext.logout();
        breadCrumbscontext.setLastCategory(undefined)
        breadCrumbscontext.setLastTask(undefined)
        navigate("/login")
    }

    function onTaskBack() {
        if (location.pathname.split('/').pop() === "edit") {
            navigate(-1)
            return
        }
        let pathBase = "/" + (breadCrumbscontext.lastTask.parent.isLearning ? "learning" : "tasks")
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
                <Col xs="1" sm="auto" lg="auto" className="p-0">
                    <Button variant="" onClick={() => onCategoryBack()}><CaretLeftFill /></Button>
                </Col>
                <Col className="pe-0" xs="7" sm="5" md>
                    <h3 className="m-0 text-truncate">{breadCrumbscontext.lastCategory && breadCrumbscontext.lastCategory.title}</h3>
                </Col>
                <UserProgressBar userContext={userContext} />
            </>
        )
    }

    function LogoAndName() {
        return (
            <>
                <Col xs="auto">
                    <Row>
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
                        <Col xs="auto" sm className="align-items-left d-grid">
                            <h3 className="my-auto mx-0 topbar-logo-text">{serverInfo.serverInfo.name}</h3>
                        </Col>
                    </Row>
                </Col>
            </>
        )
    }

    function AccountActions() {
        return (
            <Row className="justify-content-center topbar-accountactions">
                <Col xs="12" sm="auto">
                    <Button
                        variant=""
                        onClick={() => navigate("/contacts")}>
                        <InfoCircleFill />
                        <span>Contacts</span>
                    </Button>
                </Col>
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
                            <h3 className="m-0 text-truncate">Hello, {userContext.user.username}</h3>
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
                        <Col xs="8" sm="6" className="align-items-left pe-0">
                            <h3 className="m-0 text-truncate">Task categories</h3>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/learning"}>
                        <Col xs="8" sm="6" className="align-items-left pe-0">
                            <h3 className="m-0 text-truncate">Learning categories</h3>
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
                        <Col xs="1" sm="auto" lg="auto" className="p-0">
                            <Button variant="" onClick={() => onTaskBack()}><CaretLeftFill /></Button>
                        </Col>

                        <Col className="pe-0" xs="7" sm="5" md>
                            <h3 className="m-0">{breadCrumbscontext.lastTask && (breadCrumbscontext.lastTask.parent.isLearning ? "Article" : "Task")}</h3>
                        </Col>
                        <UserProgressBar userContext={userContext} />
                    </ShowForPath>

                    <ShowForPath path={"/manage"}>
                        <LogoAndName />
                    </ShowForPath>

                    <ShowForPath path={"/user/:id"}>
                        <Col xs="1" sm="auto" lg="auto" className="p-0">
                            <Button variant="" onClick={() => navigate(-1)}><CaretLeftFill /></Button>
                        </Col>
                        <LogoAndName />
                        <Col />
                    </ShowForPath>

                    <ShowForPath path={"/category/edit"}>
                        <Col xs="1" sm="auto" lg="auto" className="p-0">
                            <Button variant="" onClick={() => navigate(-1)}><CaretLeftFill /></Button>
                        </Col>
                        <LogoAndName />
                        <Col />
                    </ShowForPath>

                </OnlyLogined>

                <OnlyLogined inverse>
                    <ShowForPath path={"/"}>
                        <LogoAndName />
                        <Col />
                        <Col xs="auto">
                            <Button
                                variant=""
                                onClick={() => navigate("/contacts")}>
                                <InfoCircleFill />
                            </Button>
                        </Col>
                    </ShowForPath>

                    <ShowForPath path={"/login"}>
                        <LogoAndName />
                        <Col />
                    </ShowForPath>
                </OnlyLogined>

                <ShowForPath path={"/contacts"}>
                    <LogoAndName />
                </ShowForPath>
            </Row>
        </Container>
    )
}

export default TopBar