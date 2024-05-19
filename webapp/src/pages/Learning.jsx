import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import CategoryCard from "../components/CategoryCard"


function LearningPage() {
    return (
        <>
            <Row className="justify-content-evenly">
                <CategoryCard name="Crypto" progress="66" color="yellow" />
                <CategoryCard name="Stega" progress="33" color="green" />
                <CategoryCard name="PPC" progress="52" color="blue" />
                <CategoryCard name="OSINT" progress="96" color="pink" />
            </Row>
        </>
    )
}

export default LearningPage
