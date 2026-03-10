import NoInternetScreen from './Components/NoInternetScreen';
import useOnlineStatus from './Hooks/useIsOnline';
import RootRouterLayout from './layouts/RootRouter.Layout';

function InitOrbitRMS() {
  const isOnline = useOnlineStatus();
  if (isOnline) {
    return <RootRouterLayout />;
  } else {
    return <NoInternetScreen />;
  }
}

export default InitOrbitRMS;
