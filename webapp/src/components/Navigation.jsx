import { Navbar, ButtonGroup, Button } from "react-bootstrap"
import { HouseDoor, Person, Map, Grid } from "react-bootstrap-icons"
import { useContext } from "react"
import { useMatch, useNavigate } from "react-router-dom"
import { UserContext } from "../context/user.context"
import { ThemeContext } from "../context/theme.context"


function NavButton(props) {
    const navigate = useNavigate();

    return (
        <Button
            variant={props.variant || "light"}
            className={"navigation-button " + (useMatch(props.path + props.match) ? "navigation-button-active " : "")}
            onClick={() => navigate(props.path)
            }>
            <div className="navigation-selector-holder">
                {props.children}
                <span className="fw-medium">{props.text}</span>
            </div>
        </Button>
    )
}

function Navigation() {
    const userContext = useContext(UserContext)
    const themeContext = useContext(ThemeContext)
    return (
        <Navbar
            bg={themeContext.currentTheme}
            variant={themeContext.currentTheme}
            fixed="bottom"
            className="navigation p-0 mx-auto">

            <ButtonGroup className="navigation-selectors">
                <NavButton variant={themeContext.currentTheme} path="/" match="" exact={true} text="Home">
                    <HouseDoor size={25} />
                </NavButton>

                {userContext.loggedIn &&
                    <>
                        <NavButton variant={themeContext.currentTheme} path="/tasks" match="/*" text="Tasks">
                            <Grid size={25} />
                        </NavButton>

                        <NavButton variant={themeContext.currentTheme} path="/learning" match="/*" text="Learning">
                            <Map size={25} />
                        </NavButton>

                        <NavButton variant={themeContext.currentTheme} path="/account" match="" text="Account">
                            <Person size={25} />
                        </NavButton>
                    </>
                }
                {!userContext.loggedIn &&
                    <NavButton path="/login" match="" text="Login">
                        <Person size={30} />
                    </NavButton>
                }
            </ButtonGroup>
        </Navbar>
    )
}

export default Navigation