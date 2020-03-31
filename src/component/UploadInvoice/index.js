import React, { useState, useRef } from "react";
import './styles.css';
import PdfIcon from './img/pdf.png';
import MagnifyingGlass from './img/magnifying-glass.png';
import axios from 'axios';

const UploadInvoice = ({step, setStep, setRawData, setLoading, activeStep, setActiveStep, setIsSkip, handleManualDetail}) => {
    const [uploading, setUpload] = useState(false);
    // const [preview, setPreview] = useState('');
    const preview = '';
    const [file, setFile] = useState('');
    const [fileError, setFileError] = useState(false);
    const fileRef = useRef(null);
    const [error, setError] = useState('');

    const handleUpload = () => {
        if(file) {
            const user_data = { transaction_type: "purchase" }
            const document = new FormData();
            document.append('document', file);
            document.set("user_data", JSON.stringify(user_data))
            // const user_data = {
            //     transaction_type: 'sale',
            //     client: {
            //         name: 'Martin'
            //     }
            // }
            axios.post(`${process.env.REACT_APP_KLIPPA_URL}/parseDocument`,
                document,
                {
                    headers: {'X-Auth-Key': process.env.REACT_APP_KLIPPA_AUTH_KEY, 'Content-Type': 'multipart/form-data' }
                }).then((res) => {
                console.log('res', res.data.data)
                setIsSkip(false);
                setRawData(res.data.data);
                setStep(step + 1);
                setActiveStep(activeStep + 1)
            }).catch((err) => {
                console.log(err.message);
                setError(err.message);
            });
            setUpload(true);
        }else {
            setFileError(true);
        }
    }
    const onDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }
    const onDragLeave = (event) => {
        event.preventDefault();
    }
    const onDragOver = (event) => {
        event.preventDefault();
    }
    const onDrop = (event) => {
        console.log('files ', event.dataTransfer.files[0])
        setFile(event.dataTransfer.files[0]);
        setFileError(false);
        event.preventDefault();
    }
    const onFileSelect = (event) => {
        console.log('files ', event.target.files[0])
        setFile(event.target.files[0]);
        setFileError(false);
        event.preventDefault();
    }
    const onFileUpload = () => {
        fileRef.current.click();
    }

    return (
      <div className="UploadInvoice">
          {
              !uploading &&
              <div>
                  <div className="upload-row">
                      <div className="upload-heading">
                          <p>Please upload your invoice</p>
                      </div>
                  </div>
                  <br />
                  <div className="upload-row">
                      <div
                          className="upload-section"
                          onDragEnter={onDragEnter}
                          onDragLeave={onDragLeave}
                          onDragOver={onDragOver}
                          onDrop={onDrop}
                          onClick={onFileUpload}
                          style={{ backgroundImage: `url(${preview})`, backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
                      >
                          { !preview &&
                              <div>
                                  <img style={{ width: '62px'}} src={require('../../container/Home/img/cloud-computing.svg')} alt="lucy upload" />
                              </div>
                          }
                          { !preview &&
                              <div>
                                  <h2>{file ? file.name : 'Drag and drop here'}</h2>
                              </div>
                          }
                          <input type="file" ref={fileRef} style={{display: 'none'}} onChange={onFileSelect}/>
                      </div>
                  </div>
                  <div className="upload-row">
                      <p className="inputError">{fileError ? "Please select or drag and drop file ...." : ''}</p>
                  </div>
                  <br />
                  <div className="upload-row">
                      <button onClick={() => handleUpload()} className="upload-btn">Upload</button>
                  </div>
                  <br />
                  <div className="upload-row">
                      <button onClick={() => handleManualDetail()} className="upload-btn">Enter Details Manaually</button>
                  </div>
              </div>
          }
          {
              uploading &&
              <div style={{height: '311px', width: '514px'}}>
                  <div className="upload-row">
                      <div className="upload-heading">
                          <h2>Scanning Invoice</h2>
                      </div>
                  </div>
                  <br />
                  <div className="upload-row">
                      <div className="scanning-section">
                        <div>
                            <img src={PdfIcon} alt="Pdf" className="upload-icon" />
                        </div>
                        <div>{file && file.name}</div>
                        <div className="scanning-animation-bg">
                            <div className="scanning-animation">
                                <img src={MagnifyingGlass} alt="scanning" className="upload-icon" />
                            </div>
                        </div>
                      </div>
                  </div>
                  <br />
                  <div className="upload-row">
                      {
                          error ? <h2 style={{color: 'red'}}>{error}</h2>
                              :
                              <h2 className="scanning-message">Please give us a few moments ...</h2>
                      }

                  </div>
              </div>
          }
      </div>
  );
};

export default UploadInvoice;
