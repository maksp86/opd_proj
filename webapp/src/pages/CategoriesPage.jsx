import { Row, Col, Button, Spinner } from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import CategoryCard from "../components/CategoryCard"
import { ApiContext } from "../context/api.context"
import { useNavigate } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import IsAdmin from "../components/IsAdmin"


function CategoriesPage(props) {
    const api = useContext(ApiContext)
    const pageTitle = usePageTitle()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [categoriesStats, setCategoriesStats] = useState({})

    async function LoadData() {
        let gotCategories = await api.request("/category/list?isLearning=" + props.isLearning)
        if (gotCategories && Array.isArray(gotCategories.data.value)) {

            let gotStats = await api.request("/stats/progress?isLearning=" + props.isLearning)
            if (gotStats) {
                setCategories(gotCategories.data.value)
                setCategoriesStats(gotStats.data.value)
            }
        }
    }

    useEffect(() => {
        LoadData()
        pageTitle.set((props.isLearning ? "Learning" : "Task") + " categories")
    }, [])
    return (
        <>
            <Row className="justify-content-between">
                <IsAdmin>
                    <Col>
                        <Button variant="outline-secondary" onClick={() => { navigate("/category/edit", { state: { isLearning: props.isLearning } }) }}><Plus /></Button>
                    </Col>
                </IsAdmin>
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
                        (value) => <CategoryCard key={value._id} item={value} progress={categoriesStats[value._id]} />
                    ) : (api.busy ? <Spinner /> : <h3>Nothing here</h3>)
                }
            </Row>
        </>
    )
}

export default CategoriesPage
