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

    const [tasks, setTasks] = useState([])
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
                setTasks(result.data.value)
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

    function DrawTaskRow(props) {
        if (props.tasks.length == 0) return undefined
        const xpText = location.state.item.isLearning ? "" : `${props.difficulty.value} xp`
        return (
            <>
                <Col xs="12" key={props.difficulty._id + "col"}>
                    <h3 key={props.difficulty._id + "title"} className="text-left">
                        {props.difficulty.title} <i className="fs-3 fw-normal">{xpText}</i>
                    </h3>
                </Col>
                {
                    props.tasks.map(item => <TaskCard key={item._id} item={item} parent={location.state.item} solved={tasksStats[item._id] || false} />)
                }
            </>
        )
    }

    function DrawTasks() {
        if (tasks.length > 0) {
            return difficulties.sort((prev, item) => (prev.value > item.value ? 1 : -1)).map(item => <DrawTaskRow
                difficulty={item}
                tasks={tasks.filter(task => task.difficulty == item._id)}
            />)
        }
        else if (api.busy)
            return <Spinner />
        else
            return <h3>No tasks there</h3>
    }

    return (
        <>
            <Row className="justify-content-between">
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
                <DrawTasks />
            </Row>
        </>
    )
}

export default TasksPage
