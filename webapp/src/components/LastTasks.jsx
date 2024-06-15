import { ListGroup, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import TimeAgo from "react-timeago"


function LastTasks(props) {
    const navigate = useNavigate()
    if (props.taskStats && props.taskStats.length > 0)
        return (
            <ListGroup as="ol" style={{ borderRadius: "15px" }}>
                {
                    props.taskStats.map((submit) =>
                        <ListGroup.Item
                            action
                            key={submit._id}
                            as="li"
                            onClick={() => navigate("/task/" + submit.task._id)}
                            className="d-flex justify-content-between align-items-center user-select-none">
                            <div className="ms-2 me-auto">
                                <div className="fw-semibold fs-5">{submit.task.title}</div>
                                <TimeAgo date={submit.createdAt} />
                            </div>
                            <Badge bg="secondary fs-6 fw-medium" pill>
                                {submit.task.difficulty.value} xp
                            </Badge>
                        </ListGroup.Item>
                    )
                }
            </ListGroup>
        )
    else
        return (
            <ListGroup as="ol">
                <ListGroup.Item className="text-center" style={{ borderRadius: "15px" }}>
                    <h6 className="my-2">No solved tasks</h6>
                </ListGroup.Item>
            </ListGroup>
        )
}

export default LastTasks