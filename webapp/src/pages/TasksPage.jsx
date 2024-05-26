import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, HouseDoor, Person } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import CategoryCard from "../components/CategoryCard"
import { ApiContext } from "../context/api.context"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import TaskCard from "../components/TaskCard"


function TasksPage(props) {
    const api = useContext(ApiContext)
    const pageTitle = usePageTitle()
    const navigate = useNavigate()
    const location = useLocation()

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        if (!location.state)
            navigate("/")
        else {

            async function LoadTasks() {
                let result = await api.request("/task/list?parent=" + location.state.item._id)
                if (result && Array.isArray(result.data.value)) {
                    setTasks(result.data.value)
                }
            }
            LoadTasks()
            pageTitle.set(location.state.item.title)
        }
    }, [])
    return (
        <>
            <Row>
                <Col xs="auto">
                    <Button onClick={() => { navigate("/task/edit", { state: { parent: location.state.item } }) }}>Add new task to {location.state.item.title}</Button>
                </Col>
                <Col xs="auto">
                    <Button onClick={() => { navigate("/category/edit", { state: { item: location.state.item, isLearning: location.state.item.isLearning } }) }}>Edit {location.state.item.title}</Button>
                </Col>
            </Row>
            <Row className="justify-content-evenly text-center">
                {
                    tasks.length > 0 ? tasks.map(
                        (value) => <TaskCard item={value} parent={location.state.item} />
                    ) : <h3>Nothing here</h3>
                }
            </Row>
        </>
    )
}

export default TasksPage
