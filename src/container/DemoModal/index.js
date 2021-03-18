import React, {useState} from 'react';
import DemoBank from "./DemoBank";
import Modal from 'react-awesome-modal';

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
            <Modal visible={isOpen} effect="fadeInUp" onClickAway={() => closeModal()}>
               <DemoBank />
            </Modal>
        </div>
    );
}

export default DemoModal;