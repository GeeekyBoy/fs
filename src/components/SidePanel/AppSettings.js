import React from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import styles from "./AppSettings.module.scss"
import SimpleBar from 'simplebar-react';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import ColorPicker from '../UI/fields/ColorPicker';
import Toggle from '../UI/fields/Toggle';

const AppSettings = (props) => {
  const {
    appSettings,
    dispatch
  } = props;

  const handleChange = (e) => {
    switch (e.target.name) {
      case "theme":
        dispatch(appSettingsActions.handleSetTheme(e.target.value))
        break
      case "darkMode":
        dispatch(appSettingsActions.handleSetIsDarkMode(e.target.value))
        break
      default:
        break
    }
  }

  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const removeProject = () => {
    
  }
  return (
    <>
      <div className={styles.PanelPageToolbar}>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={closePanel}
        >
          <BackArrowIcon
            width={24}
            height={24}
          />
        </button>
        <span className={styles.PanelPageTitle}>
          App Settings
        </span>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={removeProject}
        >
          <RemoveIcon
            width={24}
            height={24}
          />
        </button>
      </div>
      <SimpleBar className={styles.AppSettingsForm}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.AppSetting}>
            <ColorPicker
              label="Theme"
              name="theme"
              value={appSettings.theme}
              onChange={handleChange}
              options={[
                "red",
                "rose",
                "orange",
                "green",
                "turquoise",
                "cyan",
                "blue",
                "pink",
                "purple",
                "black",
              ]}
              colors={!appSettings.isDarkMode ? [
                "#D20E1E",
                "#E19D00",
                "#E05307",
                "#0E6D0E",
                "#009FAA",
                "#586579",
                "#0067C0",
                "#CD007B",
                "#4F4DCE",
                "#000000",
              ] : [
                "#F46762",
                "#FFD52A",
                "#FB9A44",
                "#45E532",
                "#29F7FF",
                "#ADBBC5",
                "#4CC2FF",
                "#FF4FCB",
                "#B5ADEB",
                "#FFFFFF",
              ]}
            />
            <Toggle
              label="Dark Mode"
              name="darkMode"
              value={appSettings.isDarkMode}
              onChange={handleChange}
            />
          </div>
          <input type="submit" name="submit" value="Submit"></input>
        </form>
      </SimpleBar>
    </>
  );
};

export default connect((state) => ({
  appSettings: state.appSettings
}))(AppSettings);
