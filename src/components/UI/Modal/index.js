import React from "react";
import { useWindowSize } from "../../../components/WindowSizeListener";
import SimpleBar from "simplebar-react";
import Sheet from "./Sheet";
import Dialog from "./Dialog";
import styles from "./index.module.scss"
import Button from "../Button";

const Modal = (props) => {
	const {
		primaryButtonText,
		secondaryButtonText,
		primaryButtonDisabled,
		secondaryButtonDisabled,
		title,
		children,
		onPrimaryButtonClick,
		onSecondaryButtonClick,
		modalRef
	} = props
	const { width } = useWindowSize();
	const ModalContent = (
		<>
			<div className={styles.ModalHeaderBody}>
				<div className={styles.ModalHeader}>
					<span>{title}</span>
				</div>
				<SimpleBar className={styles.ModalBody}>
					{children}
				</SimpleBar>
			</div>
			<div className={styles.ModalFooter}>
				<Button
          fullWidth
          disabled={primaryButtonDisabled}
					onClick={onPrimaryButtonClick}
				>
					{primaryButtonText}
				</Button>
				{secondaryButtonText && (
					<Button
            fullWidth
            secondary
            disabled={secondaryButtonDisabled}
						onClick={onSecondaryButtonClick}
					>
						{secondaryButtonText}
					</Button>
				)}
			</div>
		</>
	)
	return width > 768 ? (
		<Dialog ref={modalRef} content={ModalContent} />
	) : (
		<Sheet ref={modalRef} content={ModalContent} />
	);
}

export default Modal