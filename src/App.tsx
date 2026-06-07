import RootRouterLayout from '@/layouts/RootRouter.Layout';

import useOnlineStatus from '@/hooks/useIsOnline';

import NoInternetScreen from '@/components/NoInternetScreen';

function InitOrbitRMS() {
   const isOnline = useOnlineStatus();
   if (isOnline) {
      return <RootRouterLayout />;
   } else {
      return <NoInternetScreen />;
   }
}

export default InitOrbitRMS;
