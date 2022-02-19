import React from 'react';
import styles from "./LoginBanner.module.scss"
import { useNavigateNoUpdates } from '../RouterUtils';

const LoginBanner = () => {
  const navigate = useNavigateNoUpdates();
  const handleClickBanner = () => {
    navigate("/login")
  }
  return (
    <div className={styles.BannerContainer} onClick={handleClickBanner}>
      <span>Login or create a free account to save your work on cloud, collaborate with others and more…</span>
    </div>
  )
}

export default LoginBanner;