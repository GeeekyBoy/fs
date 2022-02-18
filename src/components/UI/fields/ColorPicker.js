import React, { memo } from "react"
import styles from "./ColorPicker.module.scss"

const ColorPicker = (props) => {
  const {
    value = "",
    onChange,
    colors,
    options,
    error,
    label,
    name,
    readOnly,
    disabled,
    class: className,
    style
  } = props

  const handlePick = (nextVal) => {
    if (!(readOnly || disabled)) {
      onChange({
        target: {
          value: nextVal,
          name: name,
        },
      });
    }
  };

  return (
    <div
      className={[
        styles.ColorPickerShell,
        className || ""
      ].join(" ")}
      style={style}
    >
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div
        className={[
          styles.ColorPickerContainer,
          ...(disabled && [styles.disabled] || []),
          ...(error && [styles.error] || []),
          className || "",
        ].join(" ")}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            className={[
              styles.ColorPickerOption,
              ...[options[index] === value && styles.selected || []],
              ...(readOnly && [styles.readOnly] || []),
              ...(disabled && [styles.disabled] || []),
            ].join(" ")}
            onClick={() => handlePick(options[index])}
          >
            <div style={{ backgroundColor: color }} />
          </div>
        ))}
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default memo(ColorPicker)