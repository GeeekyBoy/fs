import { nanoid } from "nanoid"
import React, { useEffect, useRef, useState } from "react"
import styles from "./Textarea.module.scss"

const Textarea = (props) => {
  const {
    name,
    value = "",
    onChange,
    placeholder,
    readOnly,
    error,
    label,
    disabled,
    className,
    style
  } = props
  const [ id ] = useState("Textarea" + nanoid(11))
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)
  const adjustSize = ({ target }) => {
    target.parentNode.dataset.replicatedValue = target.value
  }
  useEffect(() => {
    if (textareaRef.current) {
      adjustSize({ target: textareaRef.current })
    }
  }, [value])
  return (
    <div
      className={[
        styles.TextareaContainer,
        ...(error && [styles.error] || []),
        ...(isFocused && [styles.focused] || []),
        ...(readOnly && [styles.readOnly] || []),
        ...(disabled && [styles.disabled] || []),
        ...(value && [styles.filled] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      <div>
        {label && (
          <label htmlFor={id}>
            {label}
          </label>
        )}
        <textarea
          id={id}
          name={name}
          value={value || ""}
          rows={1}
          ref={textareaRef}
          placeholder={label ? null : placeholder}
          onChange={onChange}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        ></textarea>
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default Textarea