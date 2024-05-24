import { Modal } from 'react-bootstrap';

export default function ErrorMessageModal(props) {
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Something went wrong</Modal.Title>
            </Modal.Header>
            <h5>
                {props.error.status || "No further information"}
            </h5>
        </>
    )
}