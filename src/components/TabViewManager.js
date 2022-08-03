import React, { useState, createContext, useContext } from "react";
import TasksPanel from "./TasksPanel";

const initalState = {
  tabs: [["tasks", "Tasks", <TasksPanel key="tasks" />]],
  currentTab: 'tasks',
  openTab: () => {},
  closeTab: () => {},
  clearTabs: () => {},
  setCurrentTab: () => {},
};

const TabViewContext = createContext(initalState);
export const useTabView = () => useContext(TabViewContext);

const TabViewManager = ({ children }) => {
  const [tabs, setTab] = useState(initalState.tabs);
  const [currentTab, setCurrentTab] = useState('tasks');

  const openTab = (tab) => {
    if (tabs.findIndex(x => x[0] === tab[0]) === -1) {
      setTab([...tabs, tab]);
      setCurrentTab(tab[0]);
    } else if (currentTab !== tab[0]) {
      setCurrentTab(tab[0]);
    }
  };

  const closeTab = (tabId) => {
    const index = tabs.findIndex(x => x[0] === tabId);
    if (index !== -1) {
      const newTabs = [...tabs];
      newTabs.splice(index, 1);
      setTab(newTabs);
      if (currentTab === tabId) {
        setCurrentTab(newTabs[index - 1][0]);
      }
    }
  }

  const clearTabs = () => {
    setTab(tabs.slice(0, 1));
    setCurrentTab('tasks');
  }

  return (
    <TabViewContext.Provider value={{ tabs, currentTab, openTab, closeTab, clearTabs, setCurrentTab }}>
      {children}
    </TabViewContext.Provider>
  );
};

export default TabViewManager;