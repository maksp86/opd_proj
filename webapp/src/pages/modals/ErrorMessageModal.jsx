import { Modal } from 'react-bootstrap';
import getErrorMessage from '../../extras/getErrorMessage';

export default function ErrorMessageModal(props) {
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <h5 className='text-center'>
                {getErrorMessage(props.error.status) || "No further information"}
            </h5>
        </>
    )
}