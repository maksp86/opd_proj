import { useContext, useEffect, useState } from "react"
import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, InputGroup, Form, ListGroup } from "react-bootstrap"
import { ArrowLeft, ArrowRight, CaretRightFill, Check, Crosshair, Download, HouseDoor, PencilFill, Person, Reply, Send, SendFill, TrashFill, X } from "react-bootstrap-icons"
import TimeAgo from "react-timeago"
import { UserContext } from "../context/user.context"
import { ApiContext } from "../context/api.context"
import getErrorMessage from "../extras/getErrorMessage"


function CommentsComponent(props) {
    const userContext = useContext(UserContext)
    const api = useContext(ApiContext)
    const [comments, setComments] = useState([])

    const [replyingComment, setReplyingComment] = useState(undefined)

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
        if (api.error) {
            console.log("Task error", api.error);
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

    async function GetComments() {
        const result = await api.request("/task/comment/get?id=" + props.item._id)
        if (result) {
            console.log("GetComments", result)
            setComments(result.data.value)
        }
    }

    async function SendComment() {
        const result = await api.request("/task/comment/post", "POST", {
            ...formData,
            id: props.item._id,
            parent: replyingComment ? replyingComment._id : undefined
        })
        if (result) {
            console.log("SendComment", result)
            GetComments()
            setFormData({})
            setReplyingComment(undefined)
        }
    }

    useEffect(() => {
        GetComments()
    }, [])

    async function RemoveComment(id) {
        const result = await api.request("/task/comment/remove", "POST", { id })
        if (result)
            GetComments()
    }

    function CommentInstance(props) {
        return (
            <Row
                className={"mt-3 align-items-center border bg-light user-select-none " + props.className}
                style={{ borderRadius: "20px" }}>
                <Col xs="auto">
                    <Image
                        roundedCircle
                        style={{ backgroundColor: "#000", width: "5vh", height: "5vh" }}
                        src={"/api/attachments/get?id=" + props.item.author.image} />
                </Col>
                <Col>
                    <h5 className="m-0">{props.item.author.name} &#183; <i className="fs-6 fw-normal"><TimeAgo date={props.item.createdAt} /></i></h5>
                    <p className="m-0 text-break">
                        {props.item.text}
                    </p>
                </Col>
                <Col xs="auto" className="p-0">
                    <Button onClick={() => setReplyingComment(props.item)} variant="">
                        <Reply></Reply>
                    </Button>
                </Col>
                {
                    (props.item.author._id == userContext.user._id) &&
                    <Col xs="auto" className="p-0">
                        <Button onClick={() => RemoveComment(props.item._id)} variant="">
                            <TrashFill />
                        </Button>
                    </Col>}
                {props.item.children &&
                    <Row className="justify-content-center">
                        <Col xs="auto" className="d-grid">
                            <div className="vr m-auto" style={{ height: "80%" }}></div>
                        </Col>
                        <Col>
                            {props.item.children.map((item) => <CommentInstance className="mx-0" item={item} />)}
                        </Col>
                    </Row>
                }
            </Row>
        )
    }

    return (
        <Row className="justify-content-center mt-3">
            <Col sm="12" md="12" xl="8" className="card" style={{ borderRadius: "20px" }}>

                {
                    comments.map((item) => <CommentInstance className="p-2 mx-2" key={item._id} item={item} />)
                }

                <hr className="hr hr-blurry mx-4 mt-3" />
                <Row className="align-items-center px-3">
                    <Col xs="auto">
                        <Image
                            roundedCircle
                            style={{ backgroundColor: "#000", width: "6vh", height: "6vh" }}
                            src={userContext.user.image && ("/api/attachments/get?id=" + userContext.user.image)} />
                    </Col>
                    <Col>
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <p className="m-0 mb-1 fw-semibold">
                                    {!!replyingComment ? (`Reply to ${replyingComment.author.name}'s comment`) : "Leave a comment"}
                                    {!!replyingComment && <a onClick={() => setReplyingComment(undefined)} href="javascript:;"><X /></a>}
                                </p>
                            </Col>
                            {/* <Col xs="auto" className="p-0">
                                <Button className="ms-1" variant=""><X /></Button>
                            </Col> */}
                        </Row>
                        <Form.Group className="mb-3">
                            <InputGroup className="mb-2">
                                <Form.Control
                                    value={formData.text || ""}
                                    onChange={(e) => setField("text", e.target.value)}
                                    isInvalid={!!errors.text}
                                    as="textarea"
                                    placeholder="Comment..."
                                />
                                <Button onClick={() => SendComment()} variant="outline-secondary"><SendFill /></Button>
                            </InputGroup>
                            <h6 className="text-danger text-center">{errors.summary}</h6>
                        </Form.Group>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default CommentsComponent