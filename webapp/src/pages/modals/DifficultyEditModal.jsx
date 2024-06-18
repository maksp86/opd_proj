import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import { ApiContext } from "../../context/api.context";
import getErrorMessage from "../../extras/getErrorMessage";
import { ModalContext } from "../../context/modal.context";

function DifficultyEditModal(props) {
    const modalContext = useContext(ModalContext)
    const api = useContext(ApiContext);

    const [formData, setFormData] = useState(props.item ? {
        ...props.item,
        id: props.item._id,
        _id: undefined
    } : {})
    const [errors, setErrors] = useState({})

    const isEdit = (!!props.item)

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
        if (api.error && !api.error.preventNext) {
            console.error("DifficultyEditModal error", api.error);
            let errors = {}
            if (api.error.status === "validation_failed" && api.error.errors) {
                api.error.errors.forEach((error) => errors[error.path] = getErrorMessage(error.msg))
                api.error.preventNext = true;
                api.clearError();
                errors.summary = getErrorMessage(api.error.status)
            }
            setErrors(errors)
        }
    }, [api.error])

    async function processEdit() {
        setErrors({
            ...errors,
            summary: null
        })

        const result = await api.request("/difficulty/" + (isEdit ? "edit" : "create"), "POST", formData)

        if (result)
            modalContext.close()
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.item ? ("Edit category \"" + props.item.title + "\"") : "Create category"}</Modal.Title>
            </Modal.Header>
            <Container>
                <Row className="text-center">
                    <Col>
                        <FloatingLabel
                            controlId="titleInput"
                            label="Title"
                            className="mb-3">
                            <Form.Control
                                disabled={api.busy}
                                type="text"
                                placeholder="title"
                                value={formData.title || ""}
                                onChange={(e) => setField("title", e.target.value)}
                                isInvalid={!!errors.title} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.title}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="valueInput"
                            label="Value"
                            className="mb-3">
                            <Form.Control
                                disabled={api.busy}
                                type="number"
                                placeholder="value"
                                value={formData.value || 0}
                                onChange={(e) => setField("value", parseInt(e.target.value))}
                                isInvalid={!!errors.value} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.value}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="px-4">
                    <Button variant="primary" type="button" disabled={api.busy}
                        onClick={() => processEdit()}>
                        Save
                    </Button>
                </Row>
            </Container>
        </>
    )
}

export default DifficultyEditModal;