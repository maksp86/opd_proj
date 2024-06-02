import { useContext, useEffect, useState } from "react";
import { Row, Col, FloatingLabel, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { usePageTitle } from "../hooks/pageTitle.hook"
import { ApiContext } from "../context/api.context";
import Switch from "../components/Switch";
import getErrorMessage from "../extras/getErrorMessage";



function LoginPage() {
    const [registerMode, setRegisterMode] = useState(false)
    const userContext = useContext(UserContext)
    const navigate = useNavigate()
    const pageTitle = usePageTitle()
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
        pageTitle.set(registerMode ? "Register" : "Login")
    }, [registerMode])


    async function processAuth() {
        setErrors({
            ...errors,
            summary: null
        })
        const method = registerMode ? "register" : "login"
        const result = await api.request("/user/" + method, "POST", formData)

        if (result) {
            userContext.login(result.data.value);
            navigate('/')
        }
    }

    useEffect(() => {
        if (api.error && !api.error.preventNext) {
            console.log("Login error", api.error);
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
        <>
            <Row className="justify-content-center">
                <Col
                    sm="11" lg="6"
                    className="card p-4"
                    style={{
                        borderRadius: "20px"
                    }}>
                    <Row>
                        <Col>
                            <h2 className="mx-2 mb-4">{registerMode ? "Register account" : "Login"}</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FloatingLabel
                                controlId="usernameInput"
                                label="Username"
                                className="mb-3">
                                <Form.Control
                                    disabled={api.busy}
                                    type="username"
                                    placeholder="user"
                                    value={formData.username || ""}
                                    onChange={(e) => setField("username", e.target.value)}
                                    isInvalid={!!errors.username} />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.username}
                                </Form.Control.Feedback>
                            </FloatingLabel>

                            {
                                registerMode &&
                                <FloatingLabel controlId="nameInput" label="Name" className="mb-3">
                                    <Form.Control
                                        disabled={api.busy}
                                        type="name"
                                        placeholder="Ivan Ivanov"
                                        value={formData.name || ""}
                                        onChange={(e) => setField("name", e.target.value)}
                                        isInvalid={!!errors.name} />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            }

                            <FloatingLabel controlId="passwordInput" label="Password" className="mb-3">
                                <Form.Control
                                    disabled={api.busy}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password || ""}
                                    onChange={(e) => setField("password", e.target.value)}
                                    isInvalid={!!errors.password} />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.password}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                            <Row className="justify-content-end">
                                <Col xs="auto">
                                    <Switch
                                        reverse
                                        label="Show password"
                                        className="mx-2"
                                        checked={showPassword}
                                        onChange={
                                            (e) => setShowPassword(e)
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row className="text-center">
                                <h6 className="text-danger">{errors.summary}</h6>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-3 px-3 justify-content-end align-items-center">
                        <Col className="align-items-center">
                            {!registerMode &&
                                <a href="#" onClick={() => setRegisterMode(true)}>Want to register?</a>
                            }
                        </Col>
                        <Col xs="4" className="d-grid">
                            <Button variant="primary" type="button" disabled={api.busy}
                                onClick={() => { processAuth() }}>
                                {registerMode ? "Register" : "Login"}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default LoginPage;