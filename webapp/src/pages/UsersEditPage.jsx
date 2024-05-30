import { Row, Col, Button, Image, Form, ListGroup, Badge, Spinner } from "react-bootstrap"
import { ArrowClockwise, PencilFill, Plus, Trash } from "react-bootstrap-icons"
import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../context/api.context"
import { usePageTitle } from "../hooks/pageTitle.hook"
import { ModalContext } from "../context/modal.context";
import IsAdmin from "../components/IsAdmin"
import DialogModal from "./modals/DialogModal"
import AdminUserEditModal from "./modals/AdminUserEditModal"
import AdminRoleEditModal from "./modals/AdminRoleEditModal"

function UsersList(props) {
    if (props.users && props.users.length > 0) {
        return (
            <Col>
                <ListGroup
                    as="ol"
                    style={{
                        borderRadius: "20px",
                        maxHeight: "50vh",
                        overflow: "auto"
                    }}>
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
                                        {props.roles.find(role => role._id == user.role).name}
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
    }
    else
        return (
            <Col xs="auto" className="text-center">
                <h5 className="my-4">Loading...</h5>
                <Spinner />
            </Col>
        )
}

function RolesList(props) {
    if (props.roles && props.roles.length > 0)
        return (
            <Col>
                <ListGroup
                    as="ol"
                    style={{
                        borderRadius: "20px",
                        maxHeight: "50vh",
                        overflow: "auto"
                    }}>
                    {
                        props.roles.filter((role) => role.name.startsWith(props.filter || "")
                            || role._id.startsWith(props.filter || "")).map((role) =>
                                <ListGroup.Item
                                    key={role._id}
                                    as="li"
                                    className="d-flex justify-content-between align-items-center user-select-none">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-semibold fs-5">{role.name} <small className="fs-6 fw-light">{role._id}</small></div>
                                        Permissions: {role.permissions}
                                    </div>

                                    <IsAdmin>
                                        <Button
                                            onClick={() => props.onRoleEdit(role)}
                                            variant="">
                                            <PencilFill />
                                        </Button>
                                        <Button
                                            onClick={() => props.onRoleRemove(role)}
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

function ManagementPage() {
    const api = useContext(ApiContext)
    const modal = useContext(ModalContext)
    const pageTitle = usePageTitle()

    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [usersFilter, setUsersFilter] = useState("")
    const [rolesFilter, setRolesFilter] = useState("")


    async function LoadInfo() {
        const gotUsers = await api.request("/admin/user/list")
        if (gotUsers) {
            const gotRoles = await api.request("/admin/role/list")

            if (gotRoles) {
                setRoles(gotRoles.data.value)
                setUsers(gotUsers.data.value)
            }
        }
    }

    useEffect(() => {
        LoadInfo();
        pageTitle.set("Management")
    }, [])

    function onUserEdited(id, data) {
        setUsers(users.map((item) => {
            if (item._id == id)
                return { ...item, ...data }
            else
                return item
        }))
    }

    function onRoleEdited(data) {
        if (roles.some(role => role._id == data._id))
            setRoles(roles.map((item) => {
                if (item._id == data._id)
                    return { ...item, ...data }
                else
                    return item
            }))
        else
            setRoles([...roles, data])
    }

    async function removeUser(id) {
        const result = await api.request("/admin/user/remove", "POST", { id })

        if (result) {
            setUsers(users.filter(item => item._id != id))
            modal.close();
        }
    }

    async function removeRole(id) {
        const result = await api.request("/admin/role/remove", "POST", { id })

        if (result) {
            setRoles(roles.filter(item => item._id != id))
            modal.close();
        }
    }

    return (
        <>
            <Row className="my-2">
                <Col xs="auto">
                    <h3>Users</h3>
                </Col>
                <Col>
                    <Form.Control
                        value={usersFilter}
                        onChange={(e) => setUsersFilter(e.target.value)}
                        placeholder="Filter"
                    />
                </Col>
                <Col xs="auto">
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
                    filter={usersFilter} />
            </Row>

            <Row className="mt-4 mb-2">
                <Col xs="auto">
                    <h3>Roles</h3>
                </Col>
                <Col xs="auto" className="p-0">
                    <Button
                        onClick={() => {
                            modal.show(<AdminRoleEditModal
                                onComplete={onRoleEdited}
                            />)
                        }}
                        variant="">
                        <Plus />
                    </Button>
                </Col>
                <Col>
                    <Form.Control
                        value={usersFilter}
                        onChange={(e) => setRolesFilter(e.target.value)}
                        placeholder="Filter"
                    />
                </Col>
                <Col xs="auto">
                    <Button
                        onClick={LoadInfo}
                        variant="">
                        <ArrowClockwise />
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <RolesList
                    onRoleRemove={(role) => {
                        modal.show(<DialogModal
                            title="Are you sure?"
                            text={`You're deleting role ${role.name}. This action is irreversible!`}
                            actionOk={() => { removeRole(role._id) }}
                            actionCancel={() => modal.close()}
                        />)
                    }}
                    onRoleEdit={(role) => {
                        modal.show(<AdminRoleEditModal
                            role={role}
                            onComplete={onRoleEdited}
                        />)
                    }}
                    roles={roles}
                    filter={rolesFilter} />
            </Row>
        </>
    )
}

export default ManagementPage