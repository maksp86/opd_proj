import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import { ApiContext } from "../../context/api.context";
import getErrorMessage from "../../extras/getErrorMessage";
import { ModalContext } from "../../context/modal.context";

function AdminRoleEditModal(props) {
    const modalContext = useContext(ModalContext)
    const api = useContext(ApiContext);

    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})

    const isEdit = !!props.role

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
        if (api.error) {
            console.log("RoleEditModal error", api.error);
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

    useEffect(() => {
        if (isEdit)
            setFormData({
                name: props.role.name,
                permissions: props.role.permissions,
                id: props.role._id
            })
    }, [])

    async function processEdit() {
        setErrors({
            ...errors,
            summary: null
        })

        const result = await api.request("/admin/role/" + (isEdit ? "edit" : "add"), "POST", { ...formData })

        if (result) {
            props.onComplete(result.data.value)
            modalContext.close()
        }
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? ("Edit role " + props.role.name) : "Create role"}</Modal.Title>
            </Modal.Header>
            <Container>
                <Row className="text-center">
                    <Col>
                        <FloatingLabel
                            controlId="nameInput"
                            label="Name"
                            className="mb-3">
                            <Form.Control
                                disabled={api.busy}
                                type="text"
                                placeholder="user"
                                value={formData.name || ""}
                                onChange={(e) => setField("name", e.target.value)}
                                isInvalid={!!errors.name} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.name}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="permissionsInput"
                            label="Permissions"
                            className="mb-3">
                            <Form.Control
                                disabled={api.busy}
                                type="text"
                                min={0}
                                placeholder="user"
                                value={formData.permissions || ""}
                                onChange={(e) => setField("permissions", e.target.value)}
                                isInvalid={!!errors.permissions} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.permissions}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <h6 className="text-danger text-center">{errors.summary}</h6>
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
};

export default AdminRoleEditModal;