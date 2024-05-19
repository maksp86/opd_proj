import { Container, Row, Col, ProgressBar, Navbar, ButtonGroup, Button, Image } from "react-bootstrap"
import { HouseDoor, Person } from "react-bootstrap-icons"
import { useState } from "react"
import './Estyle.scss';

function Home() {
    return (
        <>           
            <Container className="forwhom">
                <Row>
                    <Col md={6} sm={12}>
                        <h5 className="text-center">Вы остановились на *name task*
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end buton">
                        <Button href="Taskchoose" variant="outline-secondary">Вернуться к заданию</Button></div>
                        </h5>  
                    </Col>
                    <Col md={6} sm={12}>
                        <h5 className="text-center">Продолжим узнавать новое?
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end buton">
                        <Button href="learningchoose" variant="outline-secondary">Вернуться к лекциям</Button>
                        </div>
                        </h5>
                    </Col>
                </Row>
            </Container>

            <Container className="about">
                <Row className="align-items-center">
                    <Col className="col text-news">
                        <h4 className="text-center  ">Welcome!!!</h4>
                        <h5 className="text-right">Добро пожаловать на сайт, где вы сможете узнать, как базовую, так и более утонченную информацию о информационной безопасности. Также вам будут предоставлены видеоролики, после их просмотра вы можете своими ручками попробовать исправить уязвимость или же вам надо будут представлены пару вопросов, чтобы вы смогли убедиться в полученной информации.</h5>
                    </Col>
                </Row>
            </Container>

            <Container className="news">
                <Row className="align-items-center">
                    <Col className="col-3 text-center text-news-img">
                        <Image src="img-b/Новости.jpg" alt="Новости" className="img-fluid" />
                    </Col>

                    <Col className="col text-news">
                        <h4 className="text-right">NEWS!!!</h4>
                        <h5 className="text-right">new</h5>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home
