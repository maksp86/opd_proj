import { useContext, useEffect, useState } from "react"
import { Row, Col, Button, InputGroup, Form } from "react-bootstrap"
import { Reply, SendFill, TrashFill, X } from "react-bootstrap-icons"
import TimeAgo from "react-timeago"
import { UserContext } from "../context/user.context"
import { ApiContext } from "../context/api.context"
import { ThemeContext } from "../context/theme.context"
import getErrorMessage from "../extras/getErrorMessage"
import AvatarImage from "./AvatarImage"
import IsAdmin from "./IsAdmin"


function CommentsComponent(props) {
    const userContext = useContext(UserContext)
    const api = useContext(ApiContext)
    const [comments, setComments] = useState([])

    const [replyingComment, setReplyingComment] = useState(undefined)

    const [errors, setErrors] = useState({})

    const themeContext = useContext(ThemeContext)

    useEffect(() => {
        if (api.error && !api.error.preventNext) {
            console.error("CommentsComponent error", api.error);
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
            setComments(result.data.value)
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
                className={`mt-3 align-items-center border bg-${themeContext.currentTheme} user-select-none ` + props.className}
                style={{ borderRadius: "20px" }}>
                <Col xs="auto">
                    <AvatarImage
                        style={{ width: "5vh", height: "5vh" }}
                        avatar={props.item.author.image}
                    />
                </Col>
                <Col className="p-0">
                    <h6 className="m-0">{props.item.author.name} &#183; <i className="fs-6 fw-normal"><TimeAgo date={props.item.createdAt} /></i></h6>
                    <p className="m-0 text-break">
                        {props.item.text}
                    </p>
                </Col>
                <Col xs="1" sm="auto">
                    <Row>
                        <Col xs="auto" className="p-0">
                            <Button onClick={() => setReplyingComment(props.item)} variant="">
                                <Reply />
                            </Button>
                        </Col>
                        <IsAdmin altStatement={props.item.author._id == userContext.user._id}>
                            <Col xs="auto" className="p-0">
                                <Button onClick={() => RemoveComment(props.item._id)} variant="">
                                    <TrashFill />
                                </Button>
                            </Col>
                        </IsAdmin>
                    </Row>
                </Col>
                {props.item.children &&
                    <Row className="justify-content-center">
                        <Col xs="auto" className="d-none d-sm-grid">
                            <div className="vr m-auto" style={{ height: "80%" }}></div>
                        </Col>
                        <Col>
                            {props.item.children.map((item) => <CommentInstance className="mx-0" key={item._id} item={item} />)}
                        </Col>
                    </Row>
                }
            </Row>
        )
    }

    function CommentWriteArea(props) {
        const [formData, setFormData] = useState({})
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

        async function SendComment() {
            const result = await api.request("/task/comment/post", "POST", {
                ...formData,
                id: props.item._id,
                parent: replyingComment ? replyingComment._id : undefined
            })
            if (result) {
                GetComments()
                setFormData({})
                setReplyingComment(undefined)
            }
        }

        return (
            <Row className="align-items-center px-3">
                <Col xs="auto">
                    <AvatarImage
                        style={{ width: "6vh", height: "6vh" }}
                        avatar={props.userContext.user.image}
                    />
                </Col>
                <Col className="p-0">
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <p className="m-0 mb-1 fw-semibold">
                                {props.replyingComment ? (`Reply to ${props.replyingComment.author.name}'s comment`) : "Leave a comment"}
                                {!!props.replyingComment && <a onClick={() => props.setReplyingComment(undefined)} href="javascript:;"><X /></a>}
                            </p>
                        </Col>
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
        )
    }

    return (
        <Row className="justify-content-center mt-3">
            <Col sm="12" md="12" xl="8" className="card" style={{ borderRadius: "20px" }}>

                {
                    comments.map((item) => <CommentInstance className="p-2 mx-2" key={item._id} item={item} />)
                }
                {
                    comments.length == 0 && <p className="text-center mt-4 mb-2">Nobody sent a comment</p>
                }

                <hr className="hr hr-blurry mx-4 mt-3" />
                <CommentWriteArea
                    item={props.item}
                    userContext={userContext}
                    replyingComment={replyingComment}
                    setReplyingComment={setReplyingComment} />
            </Col>
        </Row>
    )
}

export default CommentsComponent