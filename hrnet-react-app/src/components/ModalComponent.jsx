import React from 'react';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import '../styles/Modal.scss';

const ModalComponent = ({ isOpen, closeModal }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal Title"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        content: {
            overflow: 'visible',
            width: '300px',
            height: '60px',
            margin: 'auto',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.8)',
            border: 'none',
        },
      }}
    >
    <div className='content'>
        <button className="close-button" onClick={closeModal}>
            <FontAwesomeIcon icon={faCircleXmark} size='xl' />
            <div className='backColor'></div>
        </button>  
      <div className="modal-body">
        <p>Employee created!</p>
      </div>
    </div>  
    </ReactModal>
  );
};

export default ModalComponent;
