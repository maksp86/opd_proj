import { Row, Col, Button } from "react-bootstrap"
import { CaretRightFill, Check, PencilFill } from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom";
import IsAdmin from "./IsAdmin";

function TaskCard(props) {
    const navigate = useNavigate()

    return (
        <Col xs="11" md="11" lg="5"
            className="category-card my-2 mx-2"
            onClick={() => navigate("/task/" + props.item._id)}>
            <Row>
                <Col xs className="align-items-center my-3">
                    <div className="w-100 my-auto mx-2">
                        <h4 className={"m-0 text-start " + (props.solved && "text-decoration-line-through")}>
                            {props.item.title || "Name"}{props.solved && <Check />}
                        </h4>
                        <p className="m-0 text-start">{props.item.summary}</p>
                    </div>
                </Col>
                <Col xs="auto" className="d-flex p-0">
                    <IsAdmin>
                        <Button
                            variant=""
                            onClick={() => navigate("/task/edit", { state: { item: props.item, parent: props.parent } })}>
                            <PencilFill className="category-card-edit-icon" size={20} />
                        </Button>
                    </IsAdmin>

                    <Button
                        className="border-0"
                        variant="">
                        <CaretRightFill size={20} />
                    </Button>
                </Col>
            </Row>
        </Col>
    )
}

export default TaskCard;