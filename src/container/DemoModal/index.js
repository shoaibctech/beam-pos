import React, {useState} from 'react';
import Modal from "react-modal";
import DemoBank from "./DemoBank";

Modal.setAppElement('#root')
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border                : 'none'
    }
};
const DemoModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false)
    }
    return (
        <div>
            <div className="text-center" style={{ marginTop: '4rem' }}>
                <button className="btn btn-primary" onClick={() => setIsOpen(!isOpen)}>Pay by beam.</button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Forget Password"
            >
                <DemoBank />
            </Modal>
        </div>
    );
}

export default DemoModal;