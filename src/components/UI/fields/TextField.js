import { nanoid } from "nanoid"
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
  const [ id ] = useState("TextField_" + nanoid(11))
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const handleFieldClick = () => {
    if (!isFocused && !disabled) {
      document.getElementById(id).focus()
    }
  }
  return (
    <div
      className={[
        styles.TextFieldShell,
        ...(disabled && [styles.disabled] || []),
        ...(error && [styles.error] || []),
        ...(value && [styles.filled] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      {label && (
        <label
          htmlFor={id}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          {label}
        </label>
      )}
      <div
        className={[
          styles.TextFieldContainer,
          ...(error && [styles.error] || []),
          ...(isFocused && [styles.focused] || []),
          ...(isHovered && [styles.hovered] || []),
          ...(readOnly && [styles.readOnly] || []),
          ...((value || prefix) && [styles.filled] || [])
        ].join(" ")}
        onClick={handleFieldClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        {prefix && (
          typeof prefix === 'string' ?
          (<span>{prefix}</span>) :
          React.createElement(prefix)
        )}
        <input
          id={id}
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