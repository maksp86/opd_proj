import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, InputGroup, Form, ListGroup } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, Check, Download, HouseDoor, PencilFill, Person } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import CategoryCard from "../components/CategoryCard"
import { ApiContext } from "../context/api.context"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import Markdown from 'markdown-to-jsx'
import { useConstructor } from "../hooks/constructor.hook"
import { ModalContext } from "../context/modal.context"

function TaskPage() {
    const api = useContext(ApiContext)
    const modal = useContext(ModalContext)
    const pageTitle = usePageTitle()
    const navigate = useNavigate()
    const { id } = useParams()
    const [task, setTask] = useState({})

    const [invalidFields, setInvalidFields] = useState([]);

    const [formData, setFormData] = useState({})

    const [isSubmitted, setIsSubmitted] = useState(undefined)

    const setField = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })
        setInvalidFields([])
    }

    async function isAlreadySubmitted() {
        const result = await api.request("/submit/get?id=" + id)
        if (result && result.data.value) {
            setIsSubmitted(result.data.value)
        }

    }

    async function loadTask() {
        const result = await api.request("/task/get?id=" + id)

        if (result) {
            console.log(result.data.value)
            pageTitle.set(result.data.value.title)
            setTask(result.data.value)
            setFormData(result.data.value.answerFields.reduce((obj, item) => { return { ...obj, [item._id]: item.answer || "" } }, {}))
            isAlreadySubmitted()
        }
    }

    async function submitTask() {
        setInvalidFields([])
        const answers = Object.keys(formData).map(key => { return { _id: key, answer: formData[key] } })
        const result = await api.request("/submit/", "POST", { task: task._id, answers })

        if (result) {
            if (result.data.value.isValid) {
                setIsSubmitted(result.data.value)
            }
            else
                setInvalidFields(result.data.value.wrongFields)
        }
    }

    useEffect(() => {
        if (!id) { navigate("..") }
        else
            loadTask()
    }, [])

    function AnswersCard() {
        if (!isSubmitted) {
            return (
                <>
                    {task.answerFields.map((field) =>
                        <Row key={field._id} className="my-2">
                            <p className="mb-1 mx-1 fs-5 fw-semibold">
                                {field.text}
                            </p>
                            <InputGroup>
                                <Form.Control
                                    onChange={(e) => setField(field._id, e.target.value)}
                                    value={formData[field._id] || ""}
                                    placeholder={"Hint: " + field.hint}
                                    isInvalid={invalidFields.includes(field._id)}>
                                </Form.Control>
                                {task.answerFields.length == 1 && <Button onClick={submitTask}>Submit</Button>}
                            </InputGroup>
                        </Row>
                    )}

                    {task.answerFields.length > 1 &&
                        <Row className="align-items-center justify-content-center my-3">
                            <Col xs={6} className="d-grid">
                                <Button onClick={submitTask}>Submit</Button>
                            </Col>
                        </Row>
                    }
                </>
            )
        }
        else {
            return (
                <>
                    <p className="mx-3 mb-1 mt-3 fw-semibold fs-4">Task solved <Check /></p>
                    <p className="mx-3">You got {isSubmitted.reward} xp</p>
                </>
            )
        }
    }

    return (
        <>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <h1>{task.title}</h1>
                </Col>
                <Col>
                    <Button style={{
                        backgroundColor: "unset",
                        border: "unset"
                    }}
                        variant="light"
                        onClick={() => navigate("/task/edit", { state: { item: task, parent: task.parent } })}>
                        <PencilFill className="category-card-edit-icon" size={20} />
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={7}>
                    <Markdown options={{
                        forceBlock: true,
                        overrides: {
                            img: {
                                component: Image,
                                props: {
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
                                <AnswersCard />
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
                                                <Button variant="outline-primary" onClick={() => window.open("/api/attachments/get?id=" + item._id, "_blank")}><Download size={20} /></Button>
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                            </Col>
                        }
                    </Row>
                </Col>
            </Row >
        </>
    )
}

export default TaskPage