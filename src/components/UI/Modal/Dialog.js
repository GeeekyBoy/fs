import React from "react";
import styles from "./Dialog.module.scss"

const Dialog = ({ content }) => {
    return (
        <div className={styles.DialogShell}>
            <div className={styles.DialogContainer}>
                {content}
            </div>
        </div>
    )
}

export default Dialog