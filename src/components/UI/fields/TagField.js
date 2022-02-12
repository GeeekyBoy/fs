import React, { useState, useRef } from 'react';
import { useOuterClick } from 'react-outer-click';
import styles from "./TagField.module.scss"

const TagField = (props) => {
  const {
    name,
    label,
    value = [],
    onChange,
    error,
    readOnly,
    disabled,
    className,
    style
  } = props
  const tagFieldRef = useRef(null)
  const tagFieldInputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleTagClick = (e) => {
    const tag = e.target.innerText;
  }

  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (!(readOnly || disabled)) {
      const elemValue = e.target.innerText;
      const newValue = elemValue.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (newValue[0] === elemValue.trim()) return;
      e.target.innerText = ""
      onChange({ target: {
        value: [...new Set([...value, ...newValue])],
        name: name
      }})
    }
  }

  const handleKeyDown = (e) => {
    if (!(readOnly || disabled)) {
      if (e.code === "Backspace" || e.key === "Backspace" || e.keyCode === 8 || e.which === 8) {
        if (e.target.innerText === "" && value.length > 0) {
          const newValue = value.slice(0, value.length - 1);
          onChange({ target: {
            value: newValue,
            name: name
          }})
        }
      } else if (e.code === "Enter" || e.code === "NumpadEnter" || e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        const newValue = e.target.innerText.trim();
        if (!newValue) return;
        e.target.innerText = ""
        onChange({ target: {
          value: [...new Set([...value, newValue])],
          name: name
        }})
      }
    }
  }

  useOuterClick(tagFieldRef, () => {
    if (isFocused) {
      setIsFocused(false);
      tagFieldInputRef.current.innerText = ""
    }
  })

  return (
    <div
      className={[
        styles.TagFieldShell,
        ...(disabled && [styles.disabled] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          styles.TagFieldContainer,
          ...(isFocused && [styles.focused] || []),
          ...((value || []).length && [styles.filled] || []),
          ...(error && [styles.error] || []),
          ...(readOnly && [styles.readOnly] || []),
          className
        ].join(" ")}
        style={style}
      >
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        <div
          className={styles.TagFieldValues}
          ref={tagFieldRef}
        >
          {(value || []).map(x => (
            <span className={styles.TagItem} key={x}>
              <span onClick={handleTagClick}>{x}</span>
              {!(readOnly || disabled) && (
                <span onClick={() => {
                  const tagsSet = new Set(value || [])
                  tagsSet.delete(x)
                  onChange({ target: {
                    value: Array.from(tagsSet),
                    name: name
                  }})
                }}>
                  ×
                </span>
              )}
            </span>
          ))}
          {!(readOnly || disabled) && (
            <span
              className={styles.TagInput}
              ref={tagFieldInputRef}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onInput={handleTagSubmit}
              contentEditable={!readOnly}
            />
          )}
        </div>
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default TagField