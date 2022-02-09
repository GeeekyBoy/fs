import React, { useState } from "react"
import styles from "./TextField.module.scss"

const TextField = (props) => {
  const {
    value = "",
    onChange,
    autoComplete,
    placeholder,
    type,
    error,
    label,
    name,
    prefix,
    suffix,
    readOnly,
    disabled,
    className,
    style,
    inputRef
  } = props
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div
      className={[
        styles.TextFieldShell,
        ...(disabled && [styles.disabled] || []),
        ...(error && [styles.error] || []),
        ...(isFocused && [styles.focused] || []),
        ...(value && [styles.filled] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          styles.TextFieldContainer,
          ...(error && [styles.error] || []),
          ...(isFocused && [styles.focused] || []),
          ...(readOnly && [styles.readOnly] || []),
          ...((value || prefix) && [styles.filled] || [])
        ].join(" ")}
      >
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        {prefix && (
          typeof prefix === 'string' ?
          (<span>{prefix}</span>) :
          React.createElement(prefix)
        )}
        <input
          type={type}
          name={name}
          autoComplete={autoComplete}
          onChange={onChange}
          value={value || ""}
          placeholder={label ? null : placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          disabled={disabled}
          ref={inputRef}
        />
        {suffix && (
          typeof suffix === 'string' ?
          (<span>{suffix}</span>) :
          React.createElement(suffix)
        )}
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default TextField