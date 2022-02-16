import React from 'react';
import styles from "./Illustration.module.scss"

const Illustration = (props) => {
  const {
    illustration,
    title,
    actionLabel,
    onAction,
    secondary
  } = props
  const handleAction = () => {
    if (onAction) {
      onAction()
    }
  }
  return (
    <div
      className={[
        styles.IllustrationContainer,
        ...(secondary && [styles.secondary] || [])
      ].join(" ")}
    >
      {React.createElement(illustration)}
      <div>
        <span>
          {title}
        </span>
        {actionLabel && <button onClick={handleAction}>{actionLabel}</button>}
      </div>
    </div>
  )
}

export default Illustration;