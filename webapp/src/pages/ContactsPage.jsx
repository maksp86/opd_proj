import { Row, Col, Button, Image, Table, FloatingLabel, Form } from "react-bootstrap"
import { PencilFill } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../context/api.context"
import { usePageTitle } from "../hooks/pageTitle.hook"
import Markdown from 'markdown-to-jsx'
import IsAdmin from "../components/IsAdmin"
import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize";
import { ThemeContext } from "../context/theme.context"
import { ServerInfoContext } from "../context/serverinfo.context"
import getErrorMessage from "../extras/getErrorMessage"

function ContactsPage() {
    const pageTitle = usePageTitle()
    const api = useContext(ApiContext)
    const themeContext = useContext(ThemeContext)
    const serverInfoContext = useContext(ServerInfoContext)

    const [contactsInfo, setContactsInfo] = useState({})
    const [isEdit, setIsEdit] = useState(false)

    async function loadInfo() {
        const result = await api.request("/info/contacts")

        if (result) {
            setContactsInfo(result.data.value)
        }
    }

    useEffect(() => {
        loadInfo()
        pageTitle.set("Contacts")
    }, [])

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
            console.error("Task edit error", api.error);
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

    async function SaveInfo() {
        setErrors({
            ...errors,
            errorSummary: null
        })
        const result = await api.request("/info/", "POST", { ...formData })

        if (result) {
            setContactsInfo(formData)
            serverInfoContext.set({
                name: formData.name,
                introduction: formData.introduction
            })
            setIsEdit(false)
        }
    }

    if (!isEdit)
        return (
            <>
                <IsAdmin>
                    <Row className="mb-2">
                        <Col xs="auto">
                            <Button variant="" onClick={() => { setIsEdit(true); setFormData(contactsInfo) }}><PencilFill /></Button>
                        </Col>
                    </Row>
                </IsAdmin>
                <Row>
                    <Col>
                        <Markdown options={{
                            forceBlock: true,
                            overrides: {
                                table: {
                                    component: Table,
                                    props: {
                                        className: "table-bordered"
                                    }
                                },
                                img: {
                                    component: Image,
                                    props: {
                                        style: {
                                            backgroundColor: "white"
                                        },
                                        fluid: true,
                                    },
                                },
                            }
                        }}>
                            {contactsInfo.contactsText}
                        </Markdown>
                    </Col>
                </Row>
            </>
        )
    else
        return (
            <>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="nameInput"
                            label="Name"
                            className="mb-3">
                            <Form.Control
                                maxLength={100}
                                disabled={api.busy}
                                type="text"
                                placeholder="name"
                                value={formData.name || ""}
                                onChange={(e) => setField("name", e.target.value)}
                                isInvalid={!!errors.name} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.name}
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="introductionInput"
                            label="Introduction"
                            className="mb-3">
                            <Form.Control
                                as="textarea"
                                style={{ minHeight: '150px', maxHeight: '300px' }}
                                rows={2}
                                maxLength={1000}
                                disabled={api.busy}
                                type="text"
                                placeholder="Introduction"
                                value={formData.introduction || ""}
                                onChange={(e) => setField("introduction", e.target.value)}
                                isInvalid={!!errors.introduction} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.introduction}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MDEditor
                            data-color-mode={themeContext.currentTheme}
                            aria-disabled={api.busy}
                            value={formData.contactsText}
                            onChange={(e) => setField("contactsText", e)}
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
                <Row className="text-center">
                    <h6 className="text-danger">{errors.errorSummary}</h6>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="8" className="d-grid">
                        <Button onClick={SaveInfo}>Save</Button>
                    </Col>
                </Row>
            </>
        )
}

export default ContactsPage