import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, HouseDoor, Person } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import CategoryCard from "../components/CategoryCard"
import { ApiContext } from "../context/api.context"
import { useNavigate, useParams } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"


function CategoriesPage(props) {
    const api = useContext(ApiContext)
    const pageTitle = usePageTitle()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    useEffect(() => {
        async function LoadCategories() {
            let result = await api.request("/category/list?isLearning=" + props.isLearning)
            if (result && Array.isArray(result.data.value)) {
                setCategories(result.data.value)
            }
        }
        LoadCategories()
        pageTitle.set((props.isLearning ? "Learning" : "Task") + " categories")
    }, [])
    return (
        <>
            <Row>
                <Col>
                    <Button onClick={() => { navigate("/category/edit", { state: { isLearning: props.isLearning } }) }}>Add</Button>
                </Col>
            </Row>
            <Row className="justify-content-evenly text-center">
                {/* <CategoryCard item={{title: "Cryptography", color: "#D04AFF"}} progress="33" />
                <CategoryCard item={{title: "Web technologies", color: "#FF4A4A"}} progress="33" />
                <CategoryCard item={{title: "Reverse-engineering", color: "#FF4ACC"}} progress="33" />
                <CategoryCard item={{title: "Steganography", color: "#39ACFF"}} progress="33" />
                <CategoryCard item={{title: "Programming", color: "#C5FF4A"}} progress="33" />
                <CategoryCard item={{title: "Research of hackers", color: "#FFD74A"}} progress="33" /> */}
                {
                    categories.length > 0 ? categories.map(
                        (value) => <CategoryCard key={value.shortname} item={value} progress="33" />
                    ) : <h3>Nothing here</h3>
                }
            </Row>
        </>
    )
}

export default CategoriesPage
