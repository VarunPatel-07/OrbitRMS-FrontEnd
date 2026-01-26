import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { v4 as uuidv4 } from 'uuid';

import {
  getEnterAnimationClass,
  getExitAnimationClass,
} from '../../constant/constant';

export interface NotificationObject {
  id: string;
  success: boolean;
  message: string;
  showNotification: boolean;
  notificationDirection:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'center';
}
export interface NotificationContextApiProps {
  notificationInfoArray: Array<NotificationObject>;

  handelNotification: (
    data: NotificationFunctionParamsInterface,
    direction:
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center',
    timeOut?: number
  ) => void;
}
export interface NotificationFunctionParamsInterface {
  success: boolean;
  message: string;
}

const NotificationContext = createContext<
  NotificationContextApiProps | undefined
>(undefined);

const NotificationContextApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notificationInfoArray, setNotificationInfoArray] = useState<
    Array<NotificationObject>
  >([]);

  const handelNotification = useCallback(
    (
      data: NotificationFunctionParamsInterface,
      direction?:
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
        | 'center',
      timeOut?: number
    ) => {
      if (!data?.message) return;
      const notificationId = uuidv4();
      setNotificationInfoArray((previous) => [
        ...previous,
        {
          id: notificationId,
          success: data.success,
          message: data.message,
          notificationDirection: direction || 'top-right',
          showNotification: true,
        },
      ]);

      setTimeout(() => {
        const element = document.getElementById(notificationId);
        if (element) {
          element.classList.remove(
            getEnterAnimationClass[direction || 'top-right']
          );
          element.classList.add(
            getExitAnimationClass[direction || 'top-right']
          );
          const onAnimationEnd = () => {
            setNotificationInfoArray((previous) =>
              previous.filter((item) => item.id !== notificationId)
            );
            element.removeEventListener('animationend', onAnimationEnd);
          };

          element.addEventListener('animationend', onAnimationEnd);
        }
      }, timeOut || 3000);
    },
    []
  );

  const NotificationContextValue = useMemo(() => {
    return {
      notificationInfoArray,
      handelNotification,
    };
  }, [notificationInfoArray, handelNotification]);
  return (
    <NotificationContext.Provider value={NotificationContextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextApiProvider };
