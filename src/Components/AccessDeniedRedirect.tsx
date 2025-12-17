import { useContext, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  NotificationContext,
  NotificationContextApiProps,
} from '../Context/Notification/NotificationContextApi';
import { clearLocalSessionStorage } from '../Helper/HelperFunctions';

function AccessDeniedRedirect({
  message,
  isAccessDenied,
}: {
  message?: string;
  isAccessDenied: boolean;
}) {
  const navigate = useNavigate();
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;

    if (isAccessDenied) {
      handelNotification(
        {
          success: false,
          message: message || 'Access Denied',
        },
        'top-right',
        5000
      );

      setTimeout(() => {
        clearLocalSessionStorage();
        navigate('/auth/sign-in');
      }, 300);
    }
  }, [isAccessDenied, handelNotification, navigate]);

  return null;
}

export default AccessDeniedRedirect;
