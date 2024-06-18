import { Modal } from 'react-bootstrap';
import getErrorMessage from '../../extras/getErrorMessage';

export default function ErrorMessageModal(props) {
    return (
        <>
            <Modal.Header closeButton className='mb-2'>
                <Modal.Title className='text-danger'>Error</Modal.Title>
            </Modal.Header>
            <p className='text-center'>
                {getErrorMessage(props.error.status) || "Some error occured"}
            </p>
        </>
    )
}