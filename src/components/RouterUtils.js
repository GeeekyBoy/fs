// derived from https://github.com/flexdinesh answer

import React from 'react';
import {useLocation as useLocationOriginal, useRoute as useRouteOriginal} from 'wouter-preact';

const RouterUtilsContext = React.createContext({
  navigateRef: null,
  locationRef: null,
  paramsRef: null
});

const RouterUtils = ({children}) => {
  const [location, navigate]= useLocationOriginal()
  const [localMatch, localParams] = useRouteOriginal("/local/:projectPermalink");
  const [cloudTaskMatch, cloudTaskParams] = useRouteOriginal("/:username/:projectPermalink/:taskPermalink")
  const [cloudMatch, cloudParams] = useRouteOriginal("/:username/:projectPermalink")


  // useRef retains object reference between re-renders
  const navigateRef = React.useRef(navigate);
  const locationRef = React.useRef(location);
  const paramsRef = React.useRef({});

  navigateRef.current = navigate;
  locationRef.current = location;
  paramsRef.current = localMatch
    ? localParams
    : cloudTaskMatch
    ? cloudTaskParams
    : cloudMatch
    ? cloudParams
    : {};

  // contextValue never changes between re-renders since refs don't change between re-renders
  const contextValue = React.useMemo(() => {
    return {navigateRef, locationRef, paramsRef};
  }, [locationRef, navigateRef, paramsRef]);

  // since contextValue never changes between re-renders, components/hooks using this context
  // won't re-render when router context updates
  return <RouterUtilsContext.Provider value={contextValue}>{children}</RouterUtilsContext.Provider>;
};

export const useNavigateNoUpdates = () => {
  const {navigateRef} = React.useContext(RouterUtilsContext);
  if (navigateRef === null) {
    throw new Error(
      'RouterUtils context should be added to the React tree right below BrowserRouter for useNavigateNoUpdates hook to work. If you need router in tests or stories, please use WrappedMemoryRouter utility.',
    );
  }
  return navigateRef.current;
};

export const useLocationNoUpdates = () => {
  const {locationRef} = React.useContext(RouterUtilsContext);
  if (locationRef === null) {
    throw new Error(
      'RouterUtils context should be added to the React tree right below BrowserRouter for useLocationNoUpdates hook to work. If you need router in tests or stories, please use WrappedMemoryRouter utility.',
    );
  }
  return locationRef.current;
};

export const useParamsNoUpdates = () => {
  const {paramsRef} = React.useContext(RouterUtilsContext);
  if (paramsRef === null) {
    throw new Error(
      'RouterUtils context should be added to the React tree right below BrowserRouter for useLocationNoUpdates hook to work. If you need router in tests or stories, please use WrappedMemoryRouter utility.',
    );
  }
  return paramsRef.current;
};

export default RouterUtils;