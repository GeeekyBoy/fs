import React, { useState, useRef, useMemo } from 'react';
import { useOuterClick } from 'react-outer-click';
import styles from "./ComboBox.module.scss"
import { ReactComponent as ChevronUpIcon } from "../../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../../assets/chevron-down-outline.svg"
import { nanoid } from 'nanoid';
import ListItem from '../ListItem';

const ComboBox = (props) => {
  const {
    value = "",
    defaultValue,
    options = {},
    onChange,
    placeholder,
    error,
    label,
    name,
    readOnly,
    disabled,
    className,
    style,
    inputRef
  } = props
  const selectRef = useRef(null)
  const optionsRef = useRef(null)
  const [ id ] = useState("TextField_" + nanoid(11))
  const [isComboBoxOpened, setIsComboBoxOpened] = useState(false)
  const getValueInvertedIndex = (options, value, defaultValue) => {
    const actualValue = value || defaultValue
    const optsArr = Object.keys(options)
    return optsArr.length - optsArr.findIndex(option => option === actualValue) - 1
  }
  const valueInvertedIndex = useMemo(() => getValueInvertedIndex(options, value, defaultValue), [options, value, defaultValue])
  const toggleComboBox = (e) => {
    if (!readOnly) {
      setIsComboBoxOpened(isComboBoxOpened ? false : true)
    }
  }
  useOuterClick(selectRef, () => {
    if (isComboBoxOpened) {
      setIsComboBoxOpened(false);
    }
  })
  return (
    <div
      className={styles.ComboBoxShell}
      ref={selectRef}
      onClick={toggleComboBox}
    >
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.ComboBoxContainer}>
        <input
          className="noselect"
          name={name}
          value={options[(value || defaultValue)]}
          readOnly
        />
        <ChevronDownIcon
          width={18}
          height={18}
          strokeWidth={48}
          color="#C0C0C0"
        />
        {isComboBoxOpened && (
          <div
            ref={optionsRef}
            className={styles.Options}
            style={{
              bottom: window.innerHeight - selectRef.current.getBoundingClientRect().bottom - 5 - 35.4 * valueInvertedIndex,
              left: selectRef.current.getBoundingClientRect().left,
              width: selectRef.current.getBoundingClientRect().width - 10,
            }}
          >
            {Object.entries(options).map(x => (
              <ListItem
                key={x[0]}
                id={x[0]}
                primary={x[1]}
                selected={x[0] === (value || defaultValue)}
                onSelect={() => {
                  toggleComboBox()
                  onChange({ target: {
                    value: x[0],
                    name: name
                  }})
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboBox