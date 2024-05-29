import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image, FloatingLabel, Form, Overlay, Tooltip, ListGroup, Badge, Spinner } from "react-bootstrap"
import { ArrowClockwise, ArrowLeft, ArrowRight, CaretRightFill, Copy, Download, HouseDoor, PencilFill, Person, Trash } from "react-bootstrap-icons"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useContext, useEffect, useRef, useState } from "react"
import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize";
import { ApiContext } from "../context/api.context"
import { useLocation, useNavigate } from "react-router-dom"
import { usePageTitle } from "../hooks/pageTitle.hook"
import getErrorMessage from "../extras/getErrorMessage"
import { ModalContext } from "../context/modal.context";
import DifficultyEditModal from "./modals/DifficultyEditModal";
import AttachmentUploadModal from "./modals/AttachmentUploadModal";
import AnswerEditForm from "../components/AnswerEditForm";
import IsAdmin from "../components/IsAdmin"
import DialogModal from "./modals/DialogModal"
import AdminUserEditModal from "./modals/AdminUserEditModal"

function UsersList(props) {
    if (props.users && props.users.length > 0)
        return (
            <Col>
                <ListGroup as="ol" style={{ borderRadius: "20px" }}>
                    {
                        props.users.filter((user) => user.name.startsWith(props.filter || "")
                            || user.username.startsWith(props.filter || "")).map((user) =>
                                <ListGroup.Item
                                    key={user._id}
                                    as="li"
                                    className="d-flex justify-content-between align-items-center user-select-none">
                                    <Image
                                        style={{
                                            backgroundColor: "#000",
                                            width: "5vh",
                                            height: "5vh",
                                        }}
                                        src={user.image && ("/api/attachments/get?id=" + user.image)}
                                        roundedCircle
                                        fluid
                                    />
                                    <div className="ms-2 me-auto">
                                        <div className="fw-semibold fs-5">{user.name}</div>
                                        {user.username}
                                    </div>
                                    <Badge bg="secondary fs-6 fw-normal" pill>
                                        {props.roles[user.role].name}
                                    </Badge>

                                    <IsAdmin>
                                        <Button
                                            onClick={() => props.onUserEdit(user)}
                                            variant="">
                                            <PencilFill />
                                        </Button>
                                        <Button
                                            onClick={() => props.onUserRemove(user)}
                                            variant="">
                                            <Trash />
                                        </Button>
                                    </IsAdmin>

                                </ListGroup.Item>
                            )
                    }
                </ListGroup>
            </Col>
        )
    else
        return (
            <Col xs="auto" className="text-center">
                <h5 className="my-4">Loading...</h5>
                <Spinner />
            </Col>
        )
}

function UsersEditPage(props) {
    const api = useContext(ApiContext)
    const modal = useContext(ModalContext)
    const pageTitle = usePageTitle()

    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [filter, setFilter] = useState("")


    async function LoadInfo() {
        const gotUsers = await api.request("/admin/user/list")
        if (gotUsers) {
            const gotRoles = await api.request("/admin/role/list")

            if (gotRoles) {
                setRoles(gotRoles.data.value.reduce((obj, item) => (obj[item._id] = { ...item, _id: undefined }, obj), {}))
                setUsers(gotUsers.data.value)
            }
        }
    }

    useEffect(() => {
        LoadInfo();
        pageTitle.set("Users")
    }, [])

    function onUserEdited(id, data) {
        setUsers(users.map((item) => {
            if (item._id == id)
                return { ...item, ...data }
            else
                return item
        }))
    }

    async function removeUser(id) {
        const result = await api.request("/admin/user/remove", "POST", { id })

        if (result) {
            setUsers(users.filter(item => item._id != id))
            modal.close();
        }
    }

    return (
        <>
            <Row className="mb-2">
                <Col xs="auto">
                    <h3>Users</h3>
                </Col>
                <Col xs="6">
                    <Form.Control
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filter"
                    />
                </Col>
                <Col>
                    <Button
                        onClick={LoadInfo}
                        variant="">
                        <ArrowClockwise />
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <UsersList
                    onUserRemove={(user) => {
                        modal.show(<DialogModal
                            title="Are you sure?"
                            text={`You're deleting user ${user.name}. This action is irreversible!`}
                            actionOk={() => { removeUser(user._id) }}
                            actionCancel={() => modal.close()}
                        />)
                    }}
                    onUserEdit={(user) => {
                        modal.show(<AdminUserEditModal
                            user={user}
                            roles={roles}
                            onUserEdited={onUserEdited}
                        />)
                    }}
                    users={users}
                    roles={roles}
                    filter={filter} />
            </Row>
        </>
    )
}

export default UsersEditPage