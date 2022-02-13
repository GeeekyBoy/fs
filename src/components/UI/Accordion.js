import React, { useState, useEffect } from "react";
import styles from "./Accordion.module.scss";
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../assets/chevron-down-outline.svg"

const Accordion = (props) => {
  const [height, setHeight] = useState(0);
  const [isAccordionOpened, setIsAccordionOpened] = useState(true);

  const handleClick = () => {
    setIsAccordionOpened(!isAccordionOpened);
  };

  useEffect(() => {
    setHeight(props.height);
  }, [props.height]);

  return (
    <div
      className={[
        styles.AccordionContainer,
        ...[(props.contained && styles.contained) || []],
      ].join(" ")}
    >
      <div
        className={[styles.AccordionHeader, "noselect"].join(" ")}
        onClick={handleClick}
      >
        <span>{props.title}</span>
        {isAccordionOpened ? (
          <ChevronUpIcon
            width={24}
            height={24}
            strokeWidth={48}
          />
        ) : (
          <ChevronDownIcon
            width={24}
            height={24}
            strokeWidth={48}
          />
        )}
      </div>
      {isAccordionOpened && (
        <div className={styles.AccordionContent} style={{ height }}>
          {props.children || props.content}
        </div>
      )}
    </div>
  );
};

export default Accordion;