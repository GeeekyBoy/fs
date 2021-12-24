import React, { useState, createContext, useContext, useRef } from "react";

const initalState = {
  modalRef: null,
  showModal: () => {},
  hideModal: () => {},
};

const ModalContext = createContext(initalState);
export const useModal = () => useContext(ModalContext);

const ModalManager = ({ children }) => {
  const [modal, setModal] = useState(null);

  const modalRef = useRef(null);

  const showModal = (nextModal) => {
    setModal(React.createElement(nextModal));
  };

  const hideModal = () => {
    modalRef.current?.close().then(() => {
      setModal(null);
    });
  };

  return (
    <ModalContext.Provider value={{ modalRef, showModal, hideModal }}>
      {modal}
      {children}
    </ModalContext.Provider>
  );
};

export default ModalManager;