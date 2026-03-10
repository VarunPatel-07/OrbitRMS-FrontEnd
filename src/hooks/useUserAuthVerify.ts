import { useContext, useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';

import { verifyUsersLoginStatus } from '@/utils/api/api';
import {
  clearLocalSessionStorage,
  storeDataInSecureCookie,
} from '@/utils/helpers/commonHelpers';

export const useUserAuthVerify = (): boolean => {
  const { setGlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const navigate = useNavigate();
  const useEffectRef = useRef(false);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    const verifyUser = async () => {
      const response = await verifyUsersLoginStatus();
      if (!response) return;
      if (!response?.success) {
        handelNotification(response, 'top-right');
        setLoading(false);
        clearLocalSessionStorage();
        navigate('/auth/sign-in');
      } else {
        setLoading(false);
        const localStorageData = {
          organization_name:
            response?.data?.organization?.general_info?.organization_name,
          organization_profile_picture:
            response?.data?.organization?.general_info
              ?.organization_profile_picture,
          portal_url: response?.data?.organization?.general_info?.portal_url,
          portal_slug: response?.data?.organization?.general_info?.portal_slug,
        };

        storeDataInSecureCookie(
          JSON.stringify(localStorageData),
          'organization-info',
          true
        );
        if (response?.data) setGlobalStateProvider(response?.data);
      }
    };

    verifyUser();
  }, []);

  return loading;
};
