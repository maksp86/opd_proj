import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, HouseDoor, Person } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import CategoryCard from "../components/CategoryCard"
import { ApiContext } from "../context/api.context"
import { useNavigate, useParams } from "react-router-dom"


function CategoriesPage(props) {
    const api = useContext(ApiContext)
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
    }, [])
    return (
        <>
            <Row>
                <Col>
                    <Button onClick={() => { navigate("/category/edit", { state: { isLearning: props.isLearning } }) }}>Add</Button>
                </Col>
            </Row>
            <Row className="justify-content-evenly text-center">
                {
                    categories.length > 0 ? categories.map(
                        (value) => <CategoryCard name={value.title} progress="0" color={value.color} />
                    ) : <h3>Nothing here</h3>
                }
            </Row>
        </>
    )
}

export default CategoriesPage
