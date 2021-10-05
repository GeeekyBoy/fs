import React, { useEffect, useRef } from "react"
import styled from "styled-components"

const Textarea = (props) => {
  const {
    name,
    value,
    onChange,
    placeholder,
    readOnly,
    error,
    label,
    disabled,
    style
  } = props
  const textareaRef = useRef(null)
  const adjustSize = ({ target }) => {
    target.parentNode.dataset.replicatedValue = target.value
  }
  useEffect(() => {
    if (textareaRef.current) {
      adjustSize({ target: textareaRef.current })
    }
  }, [])
  return (
    <TextareaContainer isError={error} style={style}>
      <label htmlFor={name}>
        {label}
      </label>
      <div>
        <textarea
          name={name}
          value={value}
          ref={textareaRef}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          onInput={adjustSize}
          disabled={disabled}
        ></textarea>
      </div>
      {error && <span>{error}</span>}
    </TextareaContainer>
  )
}

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  & > label {
    color: #000000;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
  & > div {
    display: grid;
    width: 100%;
    &::after {
      content: attr(data-replicated-value) " ";
      white-space: pre-wrap;
      visibility: hidden;
    }
    & > textarea {
      resize: none;
      overflow: hidden;
      &:disabled {
        background-color: #FAFAFA;
      }
      &::placeholder {
        color: #C0C0C0;
      }
    }
    & > textarea, &::after {
      width: calc(100% - 20px);
      padding: 5px 10px;
      background-color: rgba(255, 255, 255, 0.5);
      box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
      border: none;
      /* border: 1px solid ${({isError}) => isError ? "#FF0000" : "#C0C0C0"}; */
      border-radius: 8px;
      font-size: 14px;
      font-weight: 400;
      grid-area: 1 / 1 / 2 / 2;
    }
  }
  & > span {
    color: #FF0000;
    font-size: 12px;
  }
`

export default Textarea