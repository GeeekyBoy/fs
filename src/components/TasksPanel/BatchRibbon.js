import React from 'react'
import styles from "./BatchRibbon.module.scss"
import { useDispatch, useSelector } from "react-redux"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import * as appSettingsActions from "../../actions/appSettings"
import sortByRank from "../../utils/sortByRank"
import copyTask from "../../utils/copyTask"
import { panelPages } from "../../constants";
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_16_regular.svg"
import { ReactComponent as DetailsIcon } from "@fluentui/svg-icons/icons/chevron_right_16_regular.svg"
import { ReactComponent as ClipboardIcon } from "@fluentui/svg-icons/icons/clipboard_paste_16_regular.svg"
import { ReactComponent as ShareIcon } from "@fluentui/svg-icons/icons/share_16_regular.svg"
import { ReactComponent as SettingsIcon } from "@fluentui/svg-icons/icons/settings_16_regular.svg"
import { ReactComponent as ExportIcon } from "@fluentui/svg-icons/icons/cloud_arrow_down_16_regular.svg"
import { ReactComponent as ImportIcon } from "@fluentui/svg-icons/icons/cloud_arrow_up_16_regular.svg"
import ComboBox from '../UI/fields/ComboBox';
import ShadowScroll from '../ShadowScroll';
import { useModal } from '../ModalManager';
import modals from '../modals';
import generateRank from '../../utils/generateRank'
import Button from '../UI/Button'
import IconButton from '../UI/IconButton'

const BatchRibbon = () => {
  const dispatch = useDispatch();
  const batchCount = useSelector(state => state.app.selectedTasks?.length);
  const openPanel = () => {
    dispatch(appActions.setRightPanelPage(panelPages.BATCH_HUB));
    dispatch(appActions.handleSetRightPanel(true));
  }
  return batchCount ? (
    <div className={styles.BatchRibbon}>
      <span>{batchCount} {batchCount === 1 ? "task" : "tasks"} selected</span>
      <div className={styles.BatchRibbonButtons}>
        <IconButton icon={RemoveIcon} />
        <IconButton icon={DetailsIcon} onClick={openPanel} />
      </div>
    </div>     
  ) : null;
}

export default BatchRibbon;
