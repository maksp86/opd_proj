import { Col, Row, Image } from "react-bootstrap"
import { useLocation } from 'react-router-dom';

function NotFound(props)
{
    const location = useLocation();
    return (
        <Row className="text-center mt-6">
            <Col>
            <h3>path {location.pathname} not found :( </h3>
            <Image className="mx-auto" src="https://cataas.com/cat/says/nuh uh?fontColor=white&type=square" />
            </Col>
        </Row>
    )
}

export default NotFound;