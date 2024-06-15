import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, FloatingLabel, Form, Modal, Alert } from "react-bootstrap"
import { ApiContext } from "../../context/api.context";
import getErrorMessage from "../../extras/getErrorMessage";
import { ModalContext } from "../../context/modal.context";
import Switch from "../../components/Switch";
import { passwordStrength } from "check-password-strength";
import checkPasswordStrength from "../../extras/checkPasswordStrength";

function PasswordChangeModal(props) {
    const modalContext = useContext(ModalContext)
    const api = useContext(ApiContext);

    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({})
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
            console.log("PasswordChangeModal error", api.error);
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

    async function processChange() {
        setErrors({
            ...errors,
            summary: null
        })

        const result = await api.request("/user/editpassword", "POST", formData)

        if (result)
            modalContext.close()
    }

    function onNewPassswordChange(password) {
        setFormData({
            ...formData,
            newpassword: password
        })

        setErrors({
            ...errors,
            newpassword: checkPasswordStrength(password, "proceed")
        })
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Change password</Modal.Title>
            </Modal.Header>
            <Container>
                <Row className="text-center">
                    <Col>
                        <FloatingLabel
                            controlId="oldpasswordInput"
                            label="Old password"
                            className="mb-3">
                            <Form.Control
                                disabled={api.busy}
                                type={showPassword ? "text" : "password"}
                                placeholder="oldpassword"
                                value={formData.oldpassword || ""}
                                onChange={(e) => setField("oldpassword", e.target.value)}
                                isInvalid={!!errors.oldpassword} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.oldpassword}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="newpasswordInput"
                            label="New password"
                            className="mb-3">
                            <Form.Control
                                disabled={api.busy}
                                type={showPassword ? "text" : "password"}
                                placeholder="newpassword"
                                value={formData.newpassword || ""}
                                onChange={(e) => onNewPassswordChange(e.target.value)}
                                isInvalid={!!errors.newpassword} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.newpassword}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                        <Switch
                            reverse
                            label="Show passwords"
                            className="mb-3 mx-2"
                            checked={showPassword}
                            onChange={
                                (e) => setShowPassword(e)
                            }
                        />
                    </Col>
                </Row>
                <Row className="px-4">
                    <Button variant="primary" type="button" disabled={api.busy}
                        onClick={() => processChange()}>
                        Change
                    </Button>
                </Row>
            </Container>
        </>
    )
}

export default PasswordChangeModal;