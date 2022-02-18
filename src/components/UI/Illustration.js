import React, { memo } from 'react';
import styles from "./Illustration.module.scss"

const Illustration = (props) => {
  const {
    illustration,
    title,
    actionLabel,
    onAction,
    actionDisabled,
    secondary,
    class: className,
    style
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
        ...(secondary && [styles.secondary] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      {React.createElement(illustration)}
      <div>
        <span>
          {title}
        </span>
        {actionLabel && (
          <button
            onClick={handleAction}
            disabled={actionDisabled}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default memo(Illustration);