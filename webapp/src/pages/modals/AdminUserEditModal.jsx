import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, ProgressBar, Button, Image, FloatingLabel, Form, Modal } from "react-bootstrap"
import Cropper from 'react-easy-crop'
import { ApiContext } from "../../context/api.context";
import { UserContext } from "../../context/user.context";
import getErrorMessage from "../../extras/getErrorMessage";
import { ModalContext } from "../../context/modal.context";

function AdminUserEditModal(props) {
    const modalContext = useContext(ModalContext)
    const api = useContext(ApiContext);

    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})

    const [isImageCrop, setIsImageCrop] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
            console.log("UserEditModal error", api.error);
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
        setFormData({
            name: props.user.name,
            bio: props.user.bio,
            role: props.user.role
        })
    }, [])

    async function processEdit() {
        setErrors({
            ...errors,
            summary: null
        })

        const result = await api.request("/admin/user/edit", "POST", { id: props.user._id, ...formData })

        if (result)
            {
                props.onUserEdited(props.user._id, formData)
                modalContext.close()
            }
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{"Edit user " + props.user.name}</Modal.Title>
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
                                type="name"
                                placeholder="user"
                                value={formData.name || ""}
                                onChange={(e) => setField("name", e.target.value)}
                                isInvalid={!!errors.name} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.name}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingTextarea2" label="Bio">
                            <Form.Control
                                as="textarea"
                                placeholder="Enter something cool"
                                style={{ minHeight: '150px', maxHeight: '300px' }}
                                rows={2}
                                maxLength={255}
                                className="mb-3"
                                disabled={api.busy}
                                value={formData.bio || ""}
                                onChange={(e) => setField("bio", e.target.value)}
                                isInvalid={!!errors.bio} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.bio}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                        <FloatingLabel
                            className="mb-3"
                            controlId="roleSelect"
                            label="Role">
                            <Form.Select
                                isInvalid={!!errors.role}
                                disabled={api.busy}
                                value={formData.role}
                                onChange={(e) => setField("role", e.target.value)}>
                                {
                                    Object.keys(props.roles).map((role) =>
                                        <option
                                            key={role}
                                            value={role}>
                                            {props.roles[role].name}
                                        </option>)
                                }
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>
                                {errors.role}
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

export default AdminUserEditModal;