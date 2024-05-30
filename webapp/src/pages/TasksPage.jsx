import { Row, Col, Button, Spinner } from "react-bootstrap"
import { PencilFill, Plus } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../context/api.context"
import { useNavigate, useLocation } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import TaskCard from "../components/TaskCard"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import IsAdmin from "../components/IsAdmin"


function TasksPage() {
    const api = useContext(ApiContext)
    const breadCrumbscontext = useContext(BreadcrumbsContext)
    const pageTitle = usePageTitle()
    const navigate = useNavigate()
    const location = useLocation()

    const [tasks, setTasks] = useState({})
    const [tasksStats, setTasksStats] = useState({})
    const [difficulties, setDifficulties] = useState([])


    async function LoadTaskStats() {
        let gotStats = await api.request("/stats/category/progress?id=" + location.state.item._id)

        if (gotStats)
            setTasksStats(gotStats.data.value)
    }


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

    useEffect(() => {
        if (!location.state)
            navigate("/")
        else {
            LoadTasks()
            LoadTaskStats()
            pageTitle.set(location.state.item.title)
            breadCrumbscontext.setLastCategory(location.state.item)
        }
    }, [])

    function DrawTask(props) {
        const xpText = location.state.item.isLearning ? "" : `${props.difficulty.value} xp`
        return (
            <>
                <Col xs="12" key={props.difficulty._id + "col"}>
                    <h3 key={props.difficulty._id + "title"} className="text-left">
                        {props.difficulty.title} <i className="fs-3 fw-normal">{xpText}</i>
                    </h3>
                </Col>
                {
                    tasks[props.difficulty._id].map((item =>
                        <TaskCard key={item._id} item={item} parent={location.state.item} solved={tasksStats[item._id] || false} />))
                }
            </>
        )
    }

    function DrawTasks() {
        const keys = Object.keys(tasks)
        if (keys.length > 0) {
            return keys.map(key => {
                const difficulty = difficulties.find((item) => item._id == key);
                return (<DrawTask key={difficulty._id} difficulty={difficulty} />)
            }
            )
        }
        return undefined
    }

    return (
        <>
            <Row>
                <IsAdmin>
                    <Col xs="auto">
                        <Button variant="outline-secondary" onClick={() => { navigate("/task/edit", { state: { parent: location.state.item } }) }}><Plus /></Button>
                    </Col>
                    <Col xs="auto">
                        <Button variant="outline-secondary" onClick={() => { navigate("/category/edit", { state: { item: location.state.item, isLearning: location.state.item.isLearning } }) }}><PencilFill /></Button>
                    </Col>
                </IsAdmin>
            </Row>
            <Row className="justify-content-evenly text-center g-2">
                {
                    <DrawTasks /> || (api.busy ? <Spinner /> : <h3>Nothing here</h3>)
                }
            </Row>
        </>
    )
}

export default TasksPage
