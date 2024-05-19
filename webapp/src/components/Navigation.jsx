import { Navbar, ButtonGroup, Button } from "react-bootstrap"
import { HouseDoor, Person, Map, Grid } from "react-bootstrap-icons"
import { useState } from "react"
import { useMatch, useNavigate } from "react-router-dom"

import "./Navigation.css"


function NavButton(props) {
    const navigate = useNavigate();

    return (
        <Button
            variant="light"
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
    return (
        <Navbar
            bg="light"
            variant="light"
            fixed="bottom"
            className="navigation p-0 mx-auto">

            <ButtonGroup className="navigation-selectors">
                <NavButton path="/" match="" exact={true} text="Home">
                    <HouseDoor size={30} />
                </NavButton>

                <NavButton path="/tasks" match="*" text="Tasks">
                    <Grid size={30} />
                </NavButton>

                <NavButton path="/learning" match="*" text="Learning">
                    <Map size={30} />
                </NavButton>

                <NavButton path="/account" match="" text="Account">
                    <Person size={30} />
                </NavButton>
            </ButtonGroup>
        </Navbar>
    )
}

export default Navigation