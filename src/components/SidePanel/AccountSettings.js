import React, { useState, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { connect } from "react-redux";
import { graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../../graphql/mutations"
import * as appActions from "../../actions/app";
import * as userActions from "../../actions/user";
import styles from "./AccountSettings.module.scss"
import { ReactComponent as LogOutIcon } from "../../assets/log-out-outline.svg"
import Button from '../UI/Button';
import TextField from '../UI/fields/TextField';
import Avatar from '../UI/Avatar';
import execGraphQL from '../../utils/execGraphQL';

const AccountSettings = forwardRef((props, ref) => {
  const {
    user: {
      data: {
        username,
        firstName,
        lastName,
        email,
        plan,
        avatar,
        abbr
      },
    },
    app: {
      isSynced
    },
    dispatch
  } = props;

  const [isBusy, setIsBusy] = useState(false)
  const [newFirstName, setNewFirstName] = useState(firstName)
  const [newLastName, setNewLastName] = useState(lastName)
  const [newEmail, setNewEmail] = useState(email)
  const [newAvatar, setNewAvatar] = useState(avatar)

  const checkIsChanaged = (
    newFirstName,
    newLastName,
    firstName,
    lastName,
  ) => (
    !(newFirstName === firstName &&
    newLastName === lastName)
  )

  const isChanged = useMemo(() => checkIsChanaged(
    newFirstName,
    newLastName,
    firstName,
    lastName
  ), [
    newFirstName,
    newLastName,
    firstName,
    lastName
  ])
  
  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
	const logOut = () => {
    return dispatch(userActions.handleSignOut(true))
	}
  const saveChanges = () => {
    setIsBusy(true)
    execGraphQL(graphqlOperation(mutations.updateUser, {
      input: {
        username,
        ...(newFirstName !== firstName && { firstName: newFirstName }),
        ...(newLastName !== lastName && { lastName: newLastName })
      }
    })).then((res) => {
      setIsBusy(false)
    }).catch(() => {
      setIsBusy(false)
    })
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Account Settings",
      actionIcon: LogOutIcon,
      submitLabel: isBusy
        ? "Saving Changes"
        : isSynced
        ? "Save Changes"
        : "No Connection!",
      submitDisabled: isBusy || !isChanged || !isSynced,
      header: (
        <div className={styles.AccountSettingsHeader}>
          <Avatar user={props.user.data} size={128} />
          <span>
            {firstName} {lastName}
          </span>
          <span>@{username}</span>
        </div>
      ),
      onClose: () => {
        closePanel();
      },
      onAction: () => {
        logOut();
      },
      onSubmit: () => {
        saveChanges();
      },
    },
  }));
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={styles.AccountSettingsForm}
    >
      <TextField
        type="text"
        name="firstName"
        label="First Name"
        placeholder="first name…"
        onChange={(e) => setNewFirstName(e.target.value)}
        value={newFirstName}
        readOnly={!isSynced}
      />
      <TextField
        type="text"
        name="lastName"
        label="Last Name"
        placeholder="last name…"
        onChange={(e) => setNewLastName(e.target.value)}
        value={newLastName}
        readOnly={!isSynced}
      />
      <TextField
        type="email"
        name="email"
        label="Email"
        placeholder="email…"
        disabled
        onChange={(e) => setNewEmail(e.target.value)}
        value={newEmail}
        readOnly={!isSynced}
      />
    </form>
  );
});

AccountSettings.displayName = "AccountSettings";

export default connect((state) => ({
  user: state.user,
  app: {
    isSynced: state.app.isSynced,
  }
}), null, null, { forwardRef: true })(AccountSettings);