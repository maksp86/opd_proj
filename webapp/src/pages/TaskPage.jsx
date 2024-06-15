import { Row, Col, Button, Image, ListGroup, Table } from "react-bootstrap"
import { Download, PencilFill, TrashFill } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../context/api.context"
import { useNavigate, useParams } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import Markdown from 'markdown-to-jsx'
import CommentsComponent from "../components/CommentsComponent"
import { BreadcrumbsContext } from "../context/breadcrumbs.context"
import IsAdmin from "../components/IsAdmin"
import AnswersCard from "../components/AnswersCard"
import { ModalContext } from "../context/modal.context"
import DialogModal from "./modals/DialogModal"

function TaskPage() {
    const breadCrumbscontext = useContext(BreadcrumbsContext)
    const api = useContext(ApiContext)
    const modal = useContext(ModalContext)
    const pageTitle = usePageTitle()
    const navigate = useNavigate()
    const { id } = useParams()
    const [task, setTask] = useState({})

    const [isSubmitted, setIsSubmitted] = useState(undefined)


    async function isAlreadySubmitted() {
        const result = await api.request("/submit/get?id=" + id)
        if (result && result.data.value) {
            setIsSubmitted(result.data.value)
        }
        else
            setIsSubmitted(false)

    }

    async function loadTask() {
        const result = await api.request("/task/get?id=" + id)

        if (result) {
            pageTitle.set(result.data.value.title)
            let loadedTask = result.data.value
            setTask({
                ...loadedTask,
                attachments: loadedTask.attachments.filter(item => !loadedTask.text.includes(`${item._id})`))
            })
            isAlreadySubmitted()
            breadCrumbscontext.setLastTask(result.data.value)
        }
    }

    async function TrySetAsRead() {
        if (isSubmitted === false && task && task.parent && task.parent.isLearning) {
            const result = await api.request("/submit/", "POST", { task: task._id, answers: [] })
        }
    }

    async function removeTask() {
        const result = await api.request("/task/remove", "POST", { id })

        if (result) {
            modal.close()
            const pathBase = "/" + (task.parent.isLearning ? "learning" : "tasks")
            navigate(pathBase + "/" + task.parent.shortname,
                { state: { item: task.parent }, replace: true })
        }
    }

    useEffect(() => {
        TrySetAsRead()
    }, [task, isSubmitted])

    useEffect(() => {
        if (!id) { navigate("..") }
        else
            loadTask()
    }, [])

    return (
        <>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <h1>{task.title}</h1>
                </Col>
                <IsAdmin>
                    <Col xs="auto">
                        <Button
                            variant=""
                            onClick={() => navigate("/task/edit", { state: { item: task, parent: task.parent } })}>
                            <PencilFill size={20} />
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant=""
                            onClick={() => modal.show(<DialogModal
                                title="Are you sure?"
                                text={`You're deleting task ${task.title}. This action is irreversible!`}
                                actionOk={removeTask}
                                actionCancel={() => modal.close()}
                            />)}>
                            <TrashFill size={20} />
                        </Button>
                    </Col>
                </IsAdmin>
            </Row>
            <Row className="justify-content-center">
                <Col sm="12" md="7">
                    <Markdown options={{
                        forceBlock: true,
                        overrides: {
                            table: {
                                component: Table,
                                props: {
                                    className: "table-bordered"
                                }
                            },
                            img: {
                                component: Image,
                                props: {
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    fluid: true,
                                },
                            },
                        }
                    }}>
                        {task.text}
                    </Markdown>
                </Col>
                <Col md={5}>
                    <Row>
                        {task.answerFields && task.answerFields.length > 0 &&
                            <Col className="card my-4 py-2 px-4" style={{ borderRadius: "20px" }}>
                                <AnswersCard
                                    isSubmitted={isSubmitted}
                                    setIsSubmitted={setIsSubmitted}
                                    task={task} />
                            </Col>
                        }
                    </Row>
                    <Row>
                        {
                            task.attachments && task.attachments.length > 0 &&
                            <Col className="card my-4 py-2 px-4" style={{ borderRadius: "20px" }}>
                                <p className="mb-1 mx-1 fs-5 fw-semibold">
                                    Attachments
                                </p>

                                <ListGroup as="ol" style={{ borderRadius: "15px" }}>
                                    {
                                        task.attachments.map((item) =>
                                            <ListGroup.Item
                                                key={item._id}
                                                as="li"
                                                className="d-flex justify-content-between align-items-center">
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-medium">{item.name}</div>
                                                </div>
                                                <Button variant="" onClick={() => window.open("/api/attachments/get?id=" + item._id, "_blank")}><Download /></Button>
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                            </Col>
                        }
                    </Row>
                </Col>
            </Row>
            {
                task._id && task.commentable && <CommentsComponent item={task} />
            }
        </>
    )
}

export default TaskPage