import React from "react";
import { useWindowSize } from "../../../components/WindowSizeListener";
import Sheet from "./Sheet";
import Dialog from "./Dialog";
import styles from "./index.module.scss"

const Modal = (props) => {
    const {
        primaryButtonText,
        secondaryButtonText,
        title,
        children,
        onPrimaryButtonClick,
        onSecondaryButtonClick,
    } = props
    const { width } = useWindowSize();
    const ModalContent = (
        <>
            <div className={styles.ModalHeaderBody}>
                <div className={styles.ModalHeader}>
                    <span>{title}</span>
                </div>
                <div className={styles.ModalBody}>
                    {children}
                </div>
            </div>
            <div className={styles.ModalFooter}>
                <button 
                    className={[
                        styles.ModalButton,
                        styles.primary,
                    ].join(" ")}
                    onClick={onPrimaryButtonClick}
                >
                    {primaryButtonText}
                </button>
                {secondaryButtonText && (
                    <button 
                        className={[
                            styles.ModalButton,
                            styles.secondary,
                        ].join(" ")}
                        onClick={onSecondaryButtonClick}
                    >
                        {secondaryButtonText}
                    </button>
                )}
            </div>
        </>
    )
    return width > 768 ? (
        <Dialog content={ModalContent} />
    ) : (
        <Sheet content={ModalContent} />
    );
}

export default Modal