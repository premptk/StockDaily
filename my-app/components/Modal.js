import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <button onClick={onClose} className="text-red-500 float-right">Close</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
