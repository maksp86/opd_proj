import { Row, Col, Button, Image, InputGroup, Form, ListGroup } from "react-bootstrap"
import { Check, Download, PencilFill } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../context/api.context"

function AnswersCard(props) {
    const [invalidFields, setInvalidFields] = useState([]);
    const [formData, setFormData] = useState({})
    const api = useContext(ApiContext)

    useEffect(() => {
        if (props.task.answerFields)
            setFormData(props.task.answerFields.reduce((obj, item) => { return { ...obj, [item._id]: item.answer || "" } }, {}))
    }, [props.task])

    const setField = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })
        setInvalidFields([])
    }

    async function submitTask() {
        setInvalidFields([])
        const answers = Object.keys(formData).map(key => { return { _id: key, answer: formData[key] } })
        const result = await api.request("/submit/", "POST", { task: props.task._id, answers })

        if (result) {
            if (result.data.value.isValid) {
                props.setIsSubmitted(result.data.value)
            }
            else
                setInvalidFields(result.data.value.wrongFields)
        }
    }
    if (!props.isSubmitted) {
        return (
            <>
                {props.task.answerFields.map((field) =>
                    <Row key={field._id} className="my-2">
                        <p className="mb-1 mx-1 fs-5 fw-semibold">
                            {field.text}
                        </p>
                        <InputGroup>
                            <Form.Control
                                onChange={(e) => setField(field._id, e.target.value)}
                                value={formData[field._id] || ""}
                                placeholder={"Hint: " + field.hint}
                                isInvalid={invalidFields.includes(field._id)}>
                            </Form.Control>
                            {props.task.answerFields.length == 1 && <Button onClick={submitTask}>Submit</Button>}
                        </InputGroup>
                    </Row>
                )}

                {props.task.answerFields.length > 1 &&
                    <Row className="align-items-center justify-content-center my-3">
                        <Col xs={6} className="d-grid">
                            <Button onClick={submitTask}>Submit</Button>
                        </Col>
                    </Row>
                }
            </>
        )
    }
    else {
        return (
            <>
                <p className="mx-3 mb-1 mt-3 fw-semibold fs-4">Task solved <Check /></p>
                <p className="mx-3">You got {props.isSubmitted.reward} xp</p>
            </>
        )
    }
}

export default AnswersCard