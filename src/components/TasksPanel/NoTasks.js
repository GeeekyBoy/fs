import React from "react";
import { ReactComponent as LoadingSpinner } from "../../assets/infinity-1s-200px.svg";
import { ReactComponent as EmptyTasksIllustration } from "../../assets/undraw_note_list_re_r4u9.svg";
import { ReactComponent as OfflineIllustration } from "../../assets/undraw_signal_searching_bhpc.svg";
import { ReactComponent as NoResultsIllustration } from "../../assets/infinity-1s-200px.svg";
import Illustration from "../UI/Illustration";

const NoTasks = (props) => {
  const { msgID } = props;
  return (
    <Illustration
      illustration={
        msgID === "LOADING"
          ? LoadingSpinner
          : msgID === "EMPTY"
          ? EmptyTasksIllustration
          : msgID === "NO_RESULTS"
          ? NoResultsIllustration
          : msgID === "OFFLINE"
          ? OfflineIllustration
          : null
      }
      title={
        msgID === "LOADING"
          ? "Tasks Are Being Fetched"
          : msgID === "EMPTY"
          ? "Tap To Create New Task"
          : msgID === "NO_RESULTS"
          ? "No Results Found"
          : msgID === "OFFLINE"
          ? "You Are Offline Now"
          : null
      }
    />
  );
};

export default NoTasks;
