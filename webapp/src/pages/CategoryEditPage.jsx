import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, FloatingLabel, Form } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, HouseDoor, Person } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../context/api.context"
import { useLocation, useNavigate } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import getErrorMessage from "../extras/getErrorMessage"


function CategoryEditPage(props) {
    const api = useContext(ApiContext)
    const location = useLocation()
    const pageTitle = usePageTitle()
    const navigate = useNavigate()

    const isEdit = location.state && location.state.item

    const [formData, setFormData] = useState({ isLearning: location.state && location.state.isLearning })
    const [errors, setErrors] = useState({})

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

    useEffect(() => {
        if (isEdit)
            setFormData(location.state.item)

        pageTitle.set(isEdit ? "Edit " + location.state.item.title : "Create category")
    }, [isEdit])

    async function processEdit() {
        setErrors({
            ...errors,
            summary: null
        })
        const method = isEdit ? "edit" : "create"
        const result = await api.request("/category/" + method, "POST", formData)

        if (result) {
            navigate('/' + (formData.isLearning ? "learning" : "tasks"))
        }
    }

    useEffect(() => {
        if (api.error) {
            console.log("Category edit error", api.error);
            let errors = {}
            if (api.error.status === "validation_failed") {
                api.error.errors.forEach((error) => errors[error.path] = getErrorMessage(error.msg))
            }
            api.error.preventNext = true;
            api.clearError();
            errors.summary = getErrorMessage(api.error.status)
            setErrors(errors)
        }
    }, [api.error])

    return (
        <Row className="justify-content-center">
            <Col md="6" style={{ borderRadius: "25px" }} className="card p-3">
                <Row>
                    <Col>
                        <h2 className="mx-2 mb-4">{isEdit ? ("Edit category \"" + location.state.item.title + "\"") : "Create category"}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {!isEdit &&
                            <Form.Group className="mx-3">
                                <Form.Check
                                    type="switch"
                                    label="Learning category"
                                    className="mb-3"
                                    checked={formData.isLearning}
                                    onChange={(e) => setField("isLearning", e.target.checked)}
                                    isInvalid={!!errors.isLearning} />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.isLearning}
                                </Form.Control.Feedback>
                            </Form.Group>
                        }
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

                        <Row className="mb-3 mx-1 align-items-center">
                            <Col sm="auto"><p className="m-0">Color</p></Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        type="color"
                                        disabled={api.busy}
                                        value={formData.color || "#FFFFFF"}
                                        onChange={(e) => setField("color", e.target.value)}
                                        title="Choose your color"
                                        isInvalid={!!errors.color}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.color}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <FloatingLabel
                            controlId="permissionsInput"
                            label="Permissions"
                            className="mb-3">
                            <Form.Control
                                maxLength={3}
                                disabled={api.busy}
                                type="permissions"
                                placeholder="permissions"
                                value={formData.permissions || ""}
                                onChange={(e) => setField("permissions", e.target.value)}
                                isInvalid={!!errors.permissions} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.permissions}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <Row className="text-center">
                            <h6 className="text-danger">{errors.summary}</h6>
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

export default CategoryEditPage
