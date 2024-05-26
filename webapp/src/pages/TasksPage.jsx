import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, HouseDoor, PencilFill, Person, Plus } from "react-bootstrap-icons"
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

    const [tasks, setTasks] = useState({})
    const [difficulties, setDifficulties] = useState([])

    useEffect(() => {
        if (!location.state)
            navigate("/")
        else {

            async function LoadTasks() {
                let result = await api.request("/task/list?parent=" + location.state.item._id)
                if (result && Array.isArray(result.data.value)) {

                    let difficultiesList = await api.request("/difficulty/list")

                    if (difficultiesList) {
                        setDifficulties(difficultiesList.data.value)

                        const groupedByDifficulty = {};

                        result.data.value.forEach((task) => {
                            const difficulty = task.difficulty;
                            groupedByDifficulty[difficulty] = groupedByDifficulty[difficulty] || [];
                            groupedByDifficulty[difficulty].push(task);
                        });
                        setTasks(groupedByDifficulty)
                    }
                }
            }
            LoadTasks()
            pageTitle.set(location.state.item.title)
        }
    }, [])

    function DrawTasks() {
        const keys = Object.keys(tasks)
        if (keys.length > 0) {
            return keys.map(key => {
                const difficulty = difficulties.find((item) => item._id == key);
                const xpText = location.state.item.isLearning ? "" : `${difficulty.value} xp`
                return (<>
                    <Col xs="12">
                        <h3 className="text-left">
                            {difficulty.title} <i className="fs-3 fw-normal">{xpText}</i>
                        </h3>
                    </Col>
                    {
                        tasks[key].map((item =>
                            <TaskCard item={item} parent={location.state.item} />))
                    }
                </>)
            }
            )
        }
        return undefined
    }

    return (
        <>
            <Row>
                <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => { navigate("/task/edit", { state: { parent: location.state.item } }) }}><Plus /></Button>
                </Col>
                <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => { navigate("/category/edit", { state: { item: location.state.item, isLearning: location.state.item.isLearning } }) }}><PencilFill /></Button>
                </Col>
            </Row>
            <Row className="justify-content-evenly text-center g-2">
                {
                    <DrawTasks /> || <h3>Nothing here</h3>
                }
            </Row>
        </>
    )
}

export default TasksPage
