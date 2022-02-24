import React, { useState, useEffect } from 'react';
import styles from "./index.module.scss"
import SimpleBar from 'simplebar-react';
import Login from './Login';
import NewAccount from './NewAccount';
import ForgotPassword from './ForgotPassword';
import Auth from "../../amplify/Auth"
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { useLocationNoUpdates, useNavigateNoUpdates } from '../RouterUtils';

const AuthFlow = () => {
  const [currPage, setCurrPage] = useState(<Login />);
  const routeLocation = useLocationNoUpdates();
  const navigate = useNavigateNoUpdates();
  const handleGoBack = () => navigate(-1);
  useEffect(() => {
    if (await Auth.isLoggedIn()) {
      navigate("/");
    }
  }, [])
  useEffect(() => {
    switch (routeLocation) {
      case "/login":
        setCurrPage(<Login />)
        break
      case "/signup":
        setCurrPage(<NewAccount />)
        break
      case "/forgot-password":
        setCurrPage(<ForgotPassword />)
        break
      default:
        break
    }
  }, [routeLocation])
  return (
    <SimpleBar className={styles.AuthFlowContainer}>
      <button 
        className={[styles.backBtn, "noselect"].join(" ")}
        onClick={handleGoBack}
      >
        <BackArrowIcon
          width={24}
          height={24}
        />
        <span>Go back</span>
      </button>
      {currPage}
    </SimpleBar>
  )
}

export default AuthFlow;