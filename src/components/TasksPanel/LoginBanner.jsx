import React from 'react';
import { navigate } from '../Router';
import styles from "./LoginBanner.module.scss"

const LoginBanner = () => {
  const handleClickBanner = () => {
    navigate("/login")
  }
  return (
    <div className={`noselect ${styles.BannerContainer}`} onClick={handleClickBanner}>
      <span>Login or create a free account to save your work on cloud, collaborate with others and more…</span>
    </div>
  )
}

export default LoginBanner;