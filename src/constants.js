import generateId from './utils/generateId'
import generateRandomWords from './utils/generateRandomWords';

export const PENDING = "PENDING"
export const OK = "OK"
export const CREATING = "CREATING"
export const REMOVING = "REMOVING"
export const LOADING = "LOADING"
export const READY = "READY"
export const NOT_ASSIGNED = "NOT_ASSIGNED"

export const commandIntents = {
  ASSIGN: "ASSIGN",
  STATUS: "STATUS",
  DESCRIPTION: "DESCRIPTION",
  DUE: "DUE",
  TAGS: "TAGS",
  COPY: "COPY",
  DUPLICATE: "DUPLICATE",
  REORDER: "REORDER",
  DELETE: "DELETE",
  UNKNOWN: "UNKNOWN"
}

export const supportedCommands = {
  ASSIGN: {
    description: "Search for a user to assign him",
    alias: "a"
  },
  STATUS: {
    description: "Change status of the task",
    alias: "st"
  },
  DESCRIPTION: {
    description: "Add a long description to the task",
    alias: null
  },
  DUE: {
    description: "Set a deadline date for the task",
    alias: "du"
  },
  TAGS: {
    description: "Add comma separated tags",
    alias: null
  },
  COPY: {
    description: "Copy this task to the clipboard",
    alias: null
  },
  DUPLICATE: {
    description: "Create a clone for the selected task",
    alias: null
  },
  DELETE: {
    description: "Delete this task permanently",
    alias: null
  }
}

export const panelPages = {
  TASK_HUB: "TASK_HUB",
  PROJECTS: "PROJECTS",
  NOTIFICATIONS: "NOTIFICATIONS",
  BATCH_HUB: "BATCH_HUB",
  ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS",
  PROJECT_SETTINGS: "PROJECT_SETTINGS",
  APP_SETTINGS: "APP_SETTINGS"
}

export const initProjectState = async (rank) => {
  const todoStatusId = generateId();
  return {
    id: generateId(),
    title: '',
    permalink: (await generateRandomWords()).join("-"),
    rank: rank,
    privacy: "public",
    permissions: "rw",
    totalTasks: 0,
    statusSet: [{
      id: todoStatusId,
      title: "Todo",
      synonym: "todo",
    }, {
      id: generateId(),
      title: "Pending",
      synonym: "pending",
    }, {
      id: generateId(),
      title: "Finished",
      synonym: "done",
    }],
    defaultStatus: todoStatusId,
    createdAt: new Date().toISOString()
  }
}

export const initTaskState = (projectId, rank, status, preset = {}) => ({
  id: generateId(),
  projectId: projectId,
  task: preset.task || "",
  rank: rank,
  description: preset.description || "",
  due: preset.due || null,
  tags: preset.tags || [],
  assignees: [],
  anonymousAssignees: [],
  invitedAssignees: [],
  status: preset.status || status,
  priority: preset.priority || "normal"
})

export const AuthState = {
  SignUp: "signup",
  SignOut: "signout",
  SignIn: "signin",
  Loading: "loading",
  SignedOut: "signedout",
  SignedIn: "signedin",
  SigningUp: "signingup",
  ConfirmSignUp: "confirmSignUp",
  confirmingSignUpCustomFlow: "confirmsignupcustomflow",
  ConfirmSignIn: "confirmSignIn",
  confirmingSignInCustomFlow: "confirmingsignincustomflow",
  VerifyingAttributes: "verifyingattributes",
  ForgotPassword: "forgotpassword",
  ResetPassword: "resettingpassword",
  SettingMFA: "settingMFA",
  TOTPSetup: "TOTPSetup",
  CustomConfirmSignIn: "customConfirmSignIn",
  VerifyContact: "verifyContact"
}