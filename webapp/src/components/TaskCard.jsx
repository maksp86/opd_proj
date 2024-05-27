import { useContext } from "react";
import { Row, Col, ProgressBar, Button } from "react-bootstrap"
import { CaretRightFill, PencilFill } from "react-bootstrap-icons"
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import IsAdmin from "./IsAdmin";

function TaskCard(props) {
    const navigate = useNavigate()
    const user = useContext(UserContext)
    return (
        <Col xs="11" md="11" lg="4" className="category-card my-2 mx-2">
            <Row>
                <Col xs className="align-items-center my-3">
                    <div className="w-100 my-auto mx-2">
                        <h3 className="m-0 text-start">{props.item.title || "Name"}</h3>
                        <p className="m-0 text-start">{props.item.summary || "Summary"}</p>
                    </div>
                </Col>
                <Col xs="auto" className="d-flex p-0">
                    <IsAdmin>
                        <Button style={{
                            backgroundColor: "unset",
                            border: "unset"
                        }}
                            variant="light"
                            onClick={() => navigate("/task/edit", { state: { item: props.item, parent: props.parent } })}>
                            <PencilFill className="category-card-edit-icon" size={20} />
                        </Button>
                    </IsAdmin>
                    
                    <Button style={{
                        backgroundColor: "unset",
                        border: "unset"
                    }}
                        variant="light"
                        onClick={() => navigate("/task/" + props.item._id)}>
                        <CaretRightFill className="category-card-go-icon" size={20} />
                    </Button>
                </Col>
            </Row>
        </Col>
    )
}

export default TaskCard;