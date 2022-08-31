import React from 'react';
import styles from "./OfflineBanner.module.scss"

const OfflineBanner = () => {
  return (
    <div className={`noselect ${styles.BannerContainer}`}>
      <span>You are browsing cached version of projects because no internet connection.</span>
    </div>
  )
}

export default OfflineBanner;