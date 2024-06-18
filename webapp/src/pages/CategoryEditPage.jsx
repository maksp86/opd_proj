import { Row, Col, Button, FloatingLabel, Form, InputGroup } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../context/api.context"
import { useLocation, useNavigate } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import getErrorMessage from "../extras/getErrorMessage"
import PermissionsSelector from "../components/PermissionsSelector"


function CategoryEditPage(props) {
    const api = useContext(ApiContext)
    const location = useLocation()
    const pageTitle = usePageTitle()
    const navigate = useNavigate()

    const isEdit = location.state && location.state.item

    const [formData, setFormData] = useState({ isLearning: location.state && location.state.isLearning, permissions: "764" })
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
        if (api.error && !api.error.preventNext) {
            console.error("Category edit error", api.error);
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
            <Col sm="12" md="10" lg="8" style={{ borderRadius: "25px" }} className="card p-3">
                <Row>
                    <Col>
                        <h3 className="mx-2 mb-4">{isEdit ? ("Edit category \"" + location.state.item.title + "\"") : "Create category"}</h3>
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

                        <Row className="mb-3 align-items-center">
                            <InputGroup hasValidation>
                                <InputGroup.Text>Color</InputGroup.Text>
                                <Form.Control
                                    type="color"
                                    className="my-1"
                                    disabled={api.busy}
                                    value={formData.color || "#FFFFFF"}
                                    onChange={(e) => setField("color", e.target.value)}
                                    title="Choose your color"
                                    isInvalid={!!errors.color}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.color}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Row>

                        <PermissionsSelector
                            value={formData.permissions}
                            isInvalid={!!errors.permissions}
                            error={errors.permissions}
                            onChange={(e) => setField("permissions", e)}
                        />

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
