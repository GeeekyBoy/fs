import React, { useState } from "react";
import styles from "./Accordion.module.scss";
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../assets/chevron-down-outline.svg"

const Accordion = (props) => {
  const {
    title,
    children,
    content,
    contained
  } = props

  const [isAccordionOpened, setIsAccordionOpened] = useState(true);

  const handleClick = () => {
    setIsAccordionOpened(!isAccordionOpened);
  };

  return (
    <div
      className={[
        styles.AccordionContainer,
        ...[(contained && styles.contained) || []],
      ].join(" ")}
    >
      <div
        className={[styles.AccordionHeader, "noselect"].join(" ")}
        onClick={handleClick}
      >
        <span>{title}</span>
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
        <div className={styles.AccordionContent}>
          {children || content}
        </div>
      )}
    </div>
  );
};

export default Accordion;