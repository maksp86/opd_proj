import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import CategoryCard from "../components/CategoryCard"


function TasksPage() {
    return (
        <>
            <Row className="justify-content-evenly">
                <CategoryCard name="Crypto" progress="66" color="yellow" lastTask="cryptoanalysis" />
                <CategoryCard name="PPC" progress="33" color="blue" lastTask="Pentagon hacking" />
                <CategoryCard name="Stega" progress="33" color="green" lastTask="pic.png" />
                <CategoryCard name="OSINT" progress="96" color="pink" lastTask="People in Paris" />
            </Row>
        </>
    )
}

export default TasksPage
