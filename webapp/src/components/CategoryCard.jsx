import { Row, Col, ProgressBar, Button } from "react-bootstrap"
import { CaretRightFill } from "react-bootstrap-icons"
import { useLocation, useNavigate } from "react-router-dom";

function CategoryCard(props) {
    const navigate = useNavigate()
    return (
        <Col xs="11" md="11" lg="5" className="category-card mx-2 my-4">
            <Row>
                <Col xs="auto" className="p-0">
                    <div
                        style={{
                            width: "2vw",
                            minWidth: "20px",
                            height: "100%",
                            backgroundColor: props.color || "red"
                        }}>
                    </div>
                </Col>
                <Col xs className="align-items-center my-3 d-flex">
                    <div className="w-100 my-auto mx-0">
                        <h3 className="m-0">{props.name || "Name"}</h3>
                        <ProgressBar
                            variant="primary"
                            now={props.progress || 0}
                            className="mt-2" />
                        {props.lastTask &&
                            <p className="fw-medium mt-2 mb-1">
                                your last task: {props.lastTask}
                            </p>
                        }
                    </div>
                </Col>
                <Col xs="auto" className="d-flex p-0">
                    <Button style={{
                        backgroundColor: "unset",
                        border: "unset"
                    }}
                        variant="light"
                        onClick={() => navigate("list")}>
                        <CaretRightFill className="category-card-go-icon" size={20} />
                    </Button>
                </Col>
            </Row>
        </Col>
    )
}

export default CategoryCard;