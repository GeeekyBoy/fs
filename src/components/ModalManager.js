import React, { useState, createContext, useContext } from "react";

const initalState = {
  showModal: () => {},
  hideModal: () => {},
};

const ModalContext = createContext(initalState);
export const useModal = () => useContext(ModalContext);

const ModalManager = ({ children }) => {
  const [modal, setModal] = useState(null);

  const showModal = (nextModal) => {
    setModal(React.createElement(nextModal));
  };

  const hideModal = () => {
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {modal}
      {children}
    </ModalContext.Provider>
  );
};

export default ModalManager;