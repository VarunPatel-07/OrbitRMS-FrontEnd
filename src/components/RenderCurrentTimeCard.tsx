import { useEffect, useState } from 'react';

import { formateDate } from '@/utils/helpers/commonHelpers';

export default function RenderCurrentTimeCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const amPm = hours >= 12 ? 'PM' : 'AM';

  const formattedTime = `${hours}:${minutes}:${seconds} ${amPm}`;
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
  });
  return (
    <div className='w-full h-full flex flex-col items-start justify-between gap-3'>
      <div className='text-black font-normal text-base w-full'>
        <span>
          {formattedDate},
          <span className='pl-1.5 font-bold'>
            {formateDate(currentTime?.toLocaleDateString(), 'DD-MMM-Y', false)}
          </span>
        </span>
      </div>

      <span className='text-black font-bold text-xl'>{formattedTime}</span>
    </div>
  );
}
