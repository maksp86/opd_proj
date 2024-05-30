import { Button, Modal } from "react-bootstrap"

function DialogModal(props) {
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{props.text}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={props.actionCancel}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={props.actionOk}>
                    Ok
                </Button>
            </Modal.Footer>
        </>
    )
}

export default DialogModal