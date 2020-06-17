import React, { useState } from 'react';
import Modal from "react-modal";
import Input from "../UI/Input";
import request from 'request';
import './styles.css';


Modal.setAppElement('#root')
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};
const ForgetPassword = ({modalIsOpen, setModalIsOpen}) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

   const  handleValidation = () => {
        let formIsValid = true;

        //Email
        if(!email){
            formIsValid = false;
            setError("Cannot be empty");
        }

        if(typeof email !== "undefined"){
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                formIsValid = false;
               setError("Email is not valid");
            }
        }

        return formIsValid;
    }
    const closeModal = () => {
       setError('');
       setEmail('');
       setMessage('');
        setModalIsOpen(false);
    }

    const requestForgetPassword = () => {
       if(!handleValidation()){
           return;
       }
        var options = {
            method: 'POST',
            url: 'https://dev-1e11vioj.eu.auth0.com/dbconnections/change_password',
            headers: {'content-type': 'application/json'},
            body: {
                client_id: 'eSfzYw2LlW9FcF00Em0xmuGF3giFHzCE',
                email: email,
                connection: 'Username-Password-Authentication'
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            setMessage(body);
            setTimeout( () => {
                closeModal();
            }, 5000)
        });
    }
    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Forget Password"
            >
                <div className="reset-container">
                    <h2>Reset Password</h2>
                    <div className="email_row">
                        <label>Enter your Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={email}
                            error={error}
                            handleChange={(e) => {
                                setError('');
                                setEmail(e)}}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className="btn-ok" onClick={requestForgetPassword}>
                            Reset Password
                        </button>
                    </div>
                    {message && <p className="success_message">{message}</p>}
                </div>
            </Modal>

        </div>
    );
}
export default ForgetPassword;
