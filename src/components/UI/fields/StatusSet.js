import React, { Fragment } from "react"
import Checkbox from "./Checkbox";
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
              onChange={() => {}}
              placeholder="Status"
            />
            <ComboBox
              value={x.synonym}
              options={{
                todo: "Todo",
                pending: "Pending",
                done: "Done",
              }}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default StatusSet