import { useState } from "react"
import { Row, Col, Button, Form, InputGroup, ListGroup } from "react-bootstrap"

function AnswerEditForm(props) {
    const [formData, setFormData] = useState({})
    const [textError, setTextError] = useState(false)

    const setField = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })
        setTextError(false)
    }

    function addAnswer() {
        if (!props.answers.some(item => item.text == formData.text)) {
            props.setAnswers([...props.answers, formData])
            setFormData({})
            setTextError(false)
        }
        else
            setTextError(true)
    }

    function removeAnswer(text) {
        props.setAnswers(props.answers.filter((item) => item.text != text))
    }

    return (
        <Col>
            <Row className="px-3 mb-3">
                <p>Questions</p>
                <ListGroup as="ol" numbered>
                    {
                        props.answers.map((item) =>
                            <ListGroup.Item
                                as="li"
                                key={item.text}
                                className="d-flex justify-content-between align-items-center">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{item.text} <i className="fw-light">{item.hint}</i></div>
                                    Answer: {item.answer}
                                </div>
                                <Button variant="outline-primary" onClick={() => removeAnswer(item.text)}>Remove</Button>
                            </ListGroup.Item>
                        )
                    }
                </ListGroup>

                <Row className="mt-2 justify-content-center align-items-center">
                    <Form.Group>
                        <Form.Text>
                            New question
                        </Form.Text>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Text"
                                value={formData.text || ""}
                                isInvalid={textError}
                                onChange={(e) => setField("text", e.target.value)} />
                            <Form.Control
                                placeholder="Hint"
                                isInvalid={textError}
                                value={formData.hint || ""}
                                onChange={(e) => setField("hint", e.target.value)} />
                        </InputGroup>

                        <InputGroup>
                            <Form.Control
                                placeholder="Answer"
                                isInvalid={textError}
                                value={formData.answer || ""}
                                onChange={(e) => setField("answer", e.target.value)} />
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Row className="mt-2 justify-content-center align-items-center">
                    <Col md="4" className="d-grid">
                        <Button size="sm" variant="secondary" onClick={addAnswer}>Add</Button>
                    </Col>
                </Row>
            </Row>
        </Col>
    )
}

export default AnswerEditForm