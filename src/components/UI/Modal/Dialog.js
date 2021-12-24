import React, { forwardRef, useImperativeHandle } from "react";
import styles from "./Dialog.module.scss"

const Dialog = forwardRef(({ content }, ref) => {

    const closeDialog = () => new Promise((resolve) => {
        resolve()
    })

    useImperativeHandle(ref, () => ({
        close() {
          return closeDialog()
        }
    }));

    return (
        <div className={styles.DialogShell}>
            <div className={styles.DialogContainer}>
                {content}
            </div>
        </div>
    )
})

Dialog.displayName = "Dialog"

export default Dialog