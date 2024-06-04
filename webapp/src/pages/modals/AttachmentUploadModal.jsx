import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import { ApiContext } from "../../context/api.context";
import getErrorMessage from "../../extras/getErrorMessage";
import { ModalContext } from "../../context/modal.context";
import PermissionsSelector from "../../components/PermissionsSelector";

function AttachmentUploadModal(props) {
    const modalContext = useContext(ModalContext)
    const api = useContext(ApiContext);

    const [formData, setFormData] = useState({ permissions: "744" })
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
        if (api.error && !api.error.preventNext) {
            console.log("AttachmentUploadModal error", api.error);
            let errors = {}
            if (api.error.status === "validation_failed") {
                api.error.preventNext = true;
                api.clearError();
                errors.summary = getErrorMessage(api.error.status)
            }
            setErrors(errors)
        }
    }, [api.error])

    async function processUpload() {
        setErrors({
            ...errors,
            summary: null
        })
        const data = new FormData()

        data.append("type", "file")
        data.append("permissions", formData.permissions)
        data.append("file", formData.file)

        const result = await api.request("/attachments/upload", "POST", data)

        if (result) { modalContext.close(); props.callback(result.data.value) }
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Upload attachment</Modal.Title>
            </Modal.Header>
            <Container>
                <Row>
                    <Col>
                        <Form.Group controlId="fileInput" className="mb-3">
                            <Form.Control
                                type="file"
                                disabled={api.busy}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setField("file", e.target.files[0])
                                    }
                                }}
                                isInvalid={!!errors.image}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.file}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* <FloatingLabel
                            controlId="permissionsInput"
                            label="Permissions"
                            className="mb-3">
                            <Form.Control
                                disabled={api.busy}
                                type="text"
                                placeholder="permissions"
                                value={formData.permissions || ""}
                                onChange={(e) => setField("permissions", e.target.value)}
                                isInvalid={!!errors.permissions} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.permissions}
                            </Form.Control.Feedback>
                        </FloatingLabel> */}

                        <PermissionsSelector
                            disabled={api.busy}
                            value={formData.permissions}
                            onChange={(e) => setField("permissions", e)}
                            isInvalid={!!errors.permissions}
                            error={errors.permissions}
                        />

                        <Row className="text-center">
                            <h6 className="text-danger">{errors.summary}</h6>
                        </Row>
                    </Col>
                </Row>
                <Row className="px-4">
                    <Button variant="primary" type="button" disabled={api.busy}
                        onClick={() => processUpload()}>
                        Upload
                    </Button>
                </Row>
            </Container>
        </>
    )
}

export default AttachmentUploadModal;