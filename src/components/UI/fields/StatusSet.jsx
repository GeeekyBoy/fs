import React, { Fragment } from "react";
import ComboBox from "./ComboBox";
import styles from "./StatusSet.module.scss";
import TextField from "./TextField";

const StatusSet = (props) => {
  const {
    value = [],
    name,
    label,
    onChange,
  } = props;
  const handleChangeTitle = (id, newTitle) => {
    if (onChange) {
      const newValue = JSON.parse(JSON.stringify(value));
      const statusIndex = newValue.findIndex((x) => x.id === id);
      newValue[statusIndex].title = newTitle;
      onChange({
        target: {
          name,
          value: newValue,
        },
      })
    }
  }
  const handleChangeSynonym = (id, newSynonym) => {
    if (onChange) {
      const newValue = JSON.parse(JSON.stringify(value));
      const statusIndex = newValue.findIndex((x) => x.id === id);
      newValue[statusIndex].synonym = newSynonym;
      onChange({
        target: {
          name,
          value: newValue,
        },
      })
    }
  }
  return (
    <div className={styles.StatusSetShell}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div className={styles.StatusSetContainer}>
        {value.map(x => (
          <Fragment key={x.id}>
            <TextField
              name="status"
              value={x.title}
              placeholder="Status"
              onChange={(e) => handleChangeTitle(x.id, e.target.value)}
            />
            <ComboBox
              value={x.synonym}
              options={[
                ["todo", "Todo"],
                ["pending", "Pending"],
                ["done", "Done"],
              ]}
              onChange={(e) => handleChangeSynonym(x.id, e.target.value)}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default StatusSet