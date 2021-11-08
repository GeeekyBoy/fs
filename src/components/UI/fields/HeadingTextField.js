import React, { useState } from "react"
import styles from "./HeadingTextField.module.scss"

const HeadingTextField = (props) => {
  const {
    value = "",
    onChange,
    autoComplete,
    placeholder,
    type,
    error,
    name,
    prefix,
    suffix,
    readOnly,
    disabled,
    style
  } = props
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div className={styles.HeadingTextFieldShell} style={style}>
      <div
        className={[
          styles.HeadingTextFieldContainer,
          ...(disabled && [styles.disabled] || []),
          ...(error && [styles.error] || []),
          ...(isFocused && [styles.focused] || [])
        ].join(" ")}
      >
        {prefix && React.createElement(prefix)}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          disabled={disabled}
        />
        {suffix && React.createElement(suffix)}
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default HeadingTextField