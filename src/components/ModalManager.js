import React, { useState, createContext, useContext } from "react";

const initalState = {
  showModal: () => {},
  hideModal: () => {},
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

const ModalManager = ({ children }) => {
  const [modal, setModal] = useState(null);

  const showModal = (nextModal) => {
    setModal(React.createElement(nextModal));
  };

  const hideModal = () => {
    setModal(null);
  };

  return (
    <GlobalModalContext.Provider value={{ showModal, hideModal }}>
      {modal}
      {children}
    </GlobalModalContext.Provider>
  );
};

export default ModalManager;