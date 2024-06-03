import { Row, Col, Button } from "react-bootstrap"
import { CaretRightFill, PencilFill } from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom";
import IsAdmin from "./IsAdmin";
import { useContext } from "react";
import { ThemeContext } from "../context/theme.context";

function CategoryCard(props) {
    const navigate = useNavigate()
    const themeContext = useContext(ThemeContext)
    return (
        <Col xs="11" md="11" lg="5" className="category-card mx-2 my-4">
            <Row>
                <Col xs="auto" className="p-0">
                    <div
                        style={{
                            width: "2vw",
                            minWidth: "20px",
                            height: "100%",
                            backgroundColor: props.item.color || "red",
                            filter: themeContext.currentTheme === "dark" && "brightness(60%)"
                        }}>
                    </div>
                </Col>
                <Col xs className="align-items-center my-3 d-flex">
                    <div className="w-100 my-auto mx-0">
                        <h3 className="m-0 text-start">{props.item.title || "Name"}</h3>
                        <div
                            className="progress mt-2"
                            style={{
                                backgroundColor: `color-mix(in srgb, ${props.item.color} 50%, white)`,
                                filter: themeContext.currentTheme === "dark" && "brightness(60%)"
                            }}
                        >
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                    width: (props.progress || 0) + "%",
                                    backgroundColor: props.item.color
                                }}
                                aria-valuenow={props.progress || 0}
                                aria-valuemin="0"
                                aria-valuemax="100">
                            </div>
                        </div>
                        {props.lastTask &&
                            <p className="fw-medium mt-2 mb-1">
                                your last task: {props.lastTask}
                            </p>
                        }
                    </div>
                </Col>
                <Col xs="auto" className="d-flex p-0">
                    <IsAdmin>
                        <Button
                            variant=""
                            onClick={() => navigate("/category/edit", { state: { item: props.item, isLearning: props.item.isLearning } })}>
                            <PencilFill className="category-card-edit-icon" size={20} />
                        </Button>
                    </IsAdmin>
                    <Button

                        variant=""
                        onClick={() => navigate("./" + props.item.shortname, { state: { item: props.item } })}>
                        <CaretRightFill className="category-card-go-icon" size={20} />
                    </Button>
                </Col>
            </Row>
        </Col>
    )
}

export default CategoryCard;