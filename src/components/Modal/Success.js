import { Modal, Button } from 'react-bootstrap'

export default function Success({ show, handleClose }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="text-dark">
            <div className="success">
                    <p className="text-success">Success Add Product</p>
            </div>
        </Modal.Body>
    </Modal>
)
}
