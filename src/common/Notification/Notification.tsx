import { useContext } from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoCloseCircleOutline } from 'react-icons/io5';

import { getEnterAnimationClass } from '../../constant/constant';
import {
  NotificationContext,
  NotificationContextApiProps,
  NotificationObject,
} from '../../Context/Notification/NotificationContextApi';
import { classNames } from '../../Helper/HelperFunctions';

function Notification() {
  // getting the value from the context api
  const { notificationInfoArray } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  //   now declaring some local State Variable

  // Example direction, change as needed

  const directionArray = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'center',
  ];

  return (
    <>
      {directionArray.map((direction) => (
        <div
          key={direction}
          className={classNames(
            'w-fit h-auto max-h-screen overflow-auto absolute z-30 bg-transparent',
            {
              'top-0 left-1/2 -translate-x-1/2': direction === 'center',
              'top-0 right-0': direction === 'top-right',
              'top-0 left-0': direction === 'top-left',
              'bottom-0 right-0': direction === 'bottom-right',
              'bottom-0 left-0': direction === 'bottom-left',
            }
          )}
        >
          <div className='w-full h-full flex flex-col-reverse items-end justify-end gap-[10px] px-5 py-5'>
            {notificationInfoArray
              .filter(
                (notification) =>
                  notification.notificationDirection === direction
              )
              .map((notification: NotificationObject) => (
                <div
                  key={notification.id}
                  id={notification.id}
                  className={`bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] rounded-md pl-3 pr-5 py-3 ${
                    getEnterAnimationClass[notification.notificationDirection]
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    {notification.success ? (
                      <FaRegCircleCheck className='text-green-600 w-5 h-5' />
                    ) : (
                      <IoCloseCircleOutline className='text-rose-600 w-6 h-6' />
                    )}
                    <p className='text-black'>
                      {notification.message || 'This Is A Test Notification'}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Notification;
