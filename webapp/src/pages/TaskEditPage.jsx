import { Row, Col, Button, FloatingLabel, Form, Overlay, Tooltip } from "react-bootstrap"
import { Copy, TrashFill } from "react-bootstrap-icons"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useContext, useEffect, useRef, useState } from "react"
import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize";
import { ApiContext } from "../context/api.context"
import { useLocation, useNavigate } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import getErrorMessage from "../extras/getErrorMessage"
import { ModalContext } from "../context/modal.context";
import DifficultyEditModal from "./modals/DifficultyEditModal";
import AttachmentUploadModal from "./modals/AttachmentUploadModal";
import AnswerEditForm from "../components/AnswerEditForm";
import { ThemeContext } from "../context/theme.context"


function TaskEditPage() {
    const api = useContext(ApiContext)
    const location = useLocation()
    const pageTitle = usePageTitle()
    const navigate = useNavigate()
    const modal = useContext(ModalContext)
    const themeContext = useContext(ThemeContext)

    const isEdit = location.state && location.state.item
    const isLearning = location.state && location.state.parent.isLearning

    const [formData, setFormData] = useState({
        isLearning: isLearning,
        difficulty: "-",
        commentable: false
    })
    const [errors, setErrors] = useState({})
    const [difficulties, setDifficulties] = useState([])
    const [attachments, setAttachments] = useState([])
    const [answers, setAnswers] = useState([])

    const setField = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })

        if (errors[field]) setErrors({
            ...errors,
            [field]: null
        })
    }

    async function loadDifficulties() {
        const result = await api.request("/difficulty/list")

        if (result) {
            setDifficulties(result.data.value)
        }
    }

    async function loadTask() {
        const result = await api.request("/task/get?id=" + location.state.item._id)

        if (result) {
            const task = result.data.value
            setFormData({ ...task, parent: task.parent._id, difficulty: task.difficulty._id })
            setAnswers(task.answerFields)
            setAttachments(task.attachments)
        }
    }

    useEffect(() => { if (!modal.isOpen) loadDifficulties() }, [modal.isOpen])

    useEffect(() => {
        if (isEdit)
            loadTask()
        setField("parent", location.state.parent._id)
        pageTitle.set(isEdit ? "Edit " + location.state.item.title : "Create task")


    }, [isEdit])

    async function processEdit() {
        setErrors({
            ...errors,
            errorSummary: null
        })
        const method = isEdit ? "edit" : "create"
        const result = await api.request("/task/" + method, "POST", { ...formData, answerFields: answers, attachments: attachments.map(item => item._id) })

        if (result)
            navigate("/task/" + result.data.value._id)
    }

    useEffect(() => {
        if (api.error && !api.error.preventNext) {
            console.log("Task edit error", api.error);
            let errors = {}
            if (api.error.status === "validation_failed" && api.error.errors) {
                api.error.errors.forEach((error) => errors[error.path] = getErrorMessage(error.msg))
            }
            api.error.preventNext = true;
            api.clearError();
            errors.errorSummary = getErrorMessage(api.error.status)
            setErrors(errors)
        }
    }, [api.error])

    async function RemoveAttachment(id) {
        const result = await api.request("/attachments/remove", "POST", { id })
        if (result)
            setAttachments(attachments.filter((item) => item._id != id))
    }

    function OnAddAttachment(item) {
        setAttachments([...attachments, item])
    }

    function AttachmentRow(props) {
        const [copied, setCopied] = useState(false)
        const target = useRef(null)
        return (
            <Row
                className="p-2 my-2 align-items-center"
                style={{ backgroundColor: "var(--bs-body-bg)", borderRadius: "5px" }}>
                <Col>
                    <p className="fw-semibold m-0">{props.item.name}</p>
                </Col>
                <Col xs="auto">
                    <CopyToClipboard
                        text={`![image](/api/attachments/get?id=${props.item._id})`}
                        onCopy={(text, result) => {
                            setCopied(result)
                            setInterval(() => {
                                setCopied(false)
                            }, 1000);
                        }}>
                        <Button
                            ref={target}
                            variant=""
                            className="me-2">
                            <Copy />
                        </Button>
                    </CopyToClipboard>
                    <Overlay target={target.current} show={copied} placement="top">
                        {(props) => (
                            <Tooltip id="overlay-tooltip" {...props}>
                                Copied!
                            </Tooltip>
                        )}
                    </Overlay>

                    <Button
                        onClick={() => RemoveAttachment(props.item._id)}
                        variant="">
                        <TrashFill />
                    </Button>
                </Col>
            </Row>
        )
    }

    return (
        <Row className="justify-content-center">
            <Col sm="12" md="10" lg="8" style={{ borderRadius: "25px" }} className="card p-3">
                <Row>
                    <Col>
                        <h3 className="mx-2 mb-4">{isEdit ? ("Edit task \"" + location.state.item.title + "\"") : ("Create task in \"" + location.state.parent.title + "\"")}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="titleInput"
                            label="Title"
                            className="mb-3">
                            <Form.Control
                                maxLength={100}
                                disabled={api.busy}
                                type="title"
                                placeholder="title"
                                value={formData.title || ""}
                                onChange={(e) => setField("title", e.target.value)}
                                isInvalid={!!errors.title} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.title}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="summaryInput"
                            label="Summary"
                            className="mb-3">
                            <Form.Control
                                maxLength={200}
                                disabled={api.busy}
                                type="summary"
                                placeholder="summary"
                                value={formData.summary || ""}
                                onChange={(e) => setField("summary", e.target.value)}
                                isInvalid={!!errors.summary} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.summary}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="shortnameInput"
                            label="Shortname"
                            className="mb-3">
                            <Form.Control
                                maxLength={20}
                                disabled={api.busy || isEdit}
                                type="shortname"
                                placeholder="shortname"
                                value={formData.shortname || ""}
                                onChange={(e) => setField("shortname", e.target.value)}
                                isInvalid={!!errors.shortname} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.shortname}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        {!isLearning &&
                            <FloatingLabel
                                controlId="maxTriesInput"
                                label="Max tries"
                                className="mb-3">
                                <Form.Control
                                    maxLength={20}
                                    disabled={api.busy}
                                    type="number"
                                    placeholder="maxTries"
                                    value={formData.maxTries || 0}
                                    onChange={(e) => setField("maxTries", parseInt(e.target.value))}
                                    isInvalid={!!errors.maxTries} />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.maxTries}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        }

                        <Row>
                            <Col>
                                <MDEditor
                                    data-color-mode={themeContext.currentTheme}
                                    aria-disabled={api.busy}
                                    value={formData.text}
                                    onChange={(e) => setField("text", e)}
                                    previewOptions={{
                                        rehypePlugins: [[rehypeSanitize]],
                                    }}
                                    textareaProps={{
                                        placeholder: 'Task text in markdown',
                                        maxLength: 10000
                                    }}
                                    className="mb-3"
                                />
                            </Col>
                        </Row>

                        <Form.Group className="mx-3">
                            <Form.Check
                                type="switch"
                                label="Is commentable"
                                className="mb-3"
                                checked={!!formData.commentable}
                                onChange={(e) => setField("commentable", e.target.checked)}
                                isInvalid={!!errors.commentable} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.commentable}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <FloatingLabel
                                    controlId="difficultySelect"
                                    label="Difficulty">
                                    <Form.Select
                                        isInvalid={!!errors.difficulty}
                                        disabled={api.busy}
                                        value={formData.difficulty}
                                        onChange={(e) => setField("difficulty", e.target.value)}>
                                        <option>-</option>
                                        {
                                            difficulties.map((value) =>
                                                <option
                                                    key={value._id}
                                                    value={value._id}>
                                                    {value.title} ({value.value})
                                                </option>)
                                        }
                                    </Form.Select>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.difficulty}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col sm="auto">
                                {(formData.difficulty == "-") &&
                                    <Button onClick={() => modal.show(<DifficultyEditModal />)}>+</Button>}
                                {(formData.difficulty != "-") &&
                                    <Button
                                        onClick={() => modal.show(
                                            <DifficultyEditModal
                                                item={difficulties.find((e) => e._id == formData.difficulty)} />
                                        )}>Edit</Button>}
                            </Col>
                        </Row>

                        <Col className="align-items-center mb-3 mx-3">
                            <p>Attachments</p>

                            {
                                attachments.map(item => <AttachmentRow key={item._id} item={item} />)
                            }

                            <Row className="mt-2 justify-content-center align-items-center">
                                <Col md="4" className="d-grid">
                                    <Button size="sm" variant="secondary" onClick={() => modal.show(<AttachmentUploadModal callback={OnAddAttachment} />)}>Add</Button>
                                </Col>
                            </Row>
                        </Col>

                        {!isLearning && <Row>
                            <AnswerEditForm answers={answers} setAnswers={setAnswers} />
                        </Row>}

                        <Row className="text-center">
                            <h6 className="text-danger">{errors.errorSummary}</h6>
                        </Row>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col sm={6} className="d-grid">
                        <Button variant="primary" type="button" disabled={api.busy}
                            onClick={() => processEdit()}>
                            Save
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default TaskEditPage
