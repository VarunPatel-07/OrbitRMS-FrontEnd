import React, { SetStateAction, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import {
  DEFAULT_LEAVE_TAB,
  LEAVE_MODULE_TAB_TYPE,
  LEAVE_MODULE_TAB_TYPE_OBJECT,
} from '@/utils/constants/global.constants';
import { classNames, IsOdd } from '@/utils/helpers/commonHelpers';

const tabs = Object.keys(
  LEAVE_MODULE_TAB_TYPE_OBJECT
) as (keyof typeof LEAVE_MODULE_TAB_TYPE_OBJECT)[];

export default function LeavesTabs({
  setShowAddLeaveModal,
}: {
  setShowAddLeaveModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [searchParam, setSearchParams] = useSearchParams();

  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const updateIndicator = (index: number) => {
    const tab = tabRefs.current[index];
    const container = containerRef.current;

    if (tab && container) {
      const { offsetWidth, offsetLeft } = tab;
      setIndicatorStyle({
        width: offsetWidth + 1,
        left: offsetLeft,
      });
    }
  };

  const handleClick = (
    index: number,
    item: keyof typeof LEAVE_MODULE_TAB_TYPE_OBJECT
  ) => {
    setShowAddLeaveModal(false);
    setActiveIndex(index);
    updateIndicator(index);

    const selectedTab = LEAVE_MODULE_TAB_TYPE_OBJECT[item];
    const params = new URLSearchParams();
    params.set('tab', selectedTab);
    setSearchParams(params);
  };

  useEffect(() => {
    updateIndicator(activeIndex);
  }, []);

  useEffect(() => {
    const tabType = searchParam.get('tab');

    if (!tabType || !LEAVE_MODULE_TAB_TYPE.includes(tabType)) {
      const params = new URLSearchParams(searchParam);
      params.set('tab', DEFAULT_LEAVE_TAB);
      setSearchParams(params);
      return;
    }

    const tabKey = Object.keys(LEAVE_MODULE_TAB_TYPE_OBJECT).find(
      (key) =>
        LEAVE_MODULE_TAB_TYPE_OBJECT[
          key as keyof typeof LEAVE_MODULE_TAB_TYPE_OBJECT
        ] === tabType
    ) as keyof typeof LEAVE_MODULE_TAB_TYPE_OBJECT | undefined;

    if (tabKey) {
      const index = tabs.indexOf(tabKey);
      if (index !== -1) {
        setActiveIndex(index);
        updateIndicator(index);
      }
    }
  }, [searchParam]);

  useEffect(() => {
    const handleResize = () => updateIndicator(activeIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <div className='flex justify-end'>
      <div
        ref={containerRef}
        className='relative flex border border-black rounded-lg overflow-hidden'
      >
        {/* Sliding Indicator */}
        <span
          className='absolute top-0 h-full bg-black transition-all duration-300 ease-in-out'
          style={{
            width: indicatorStyle.width,
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />

        {tabs.map((item, index) => (
          <Button
            type='button'
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleClick(index, item)}
            className={classNames(
              `relative z-10 px-6 py-2 text-sm capitalize whitespace-nowrap transition-colors duration-300 hover:bg-black/5 ${
                activeIndex === index ? 'text-white' : 'text-black'
              }`,
              { 'border-x border-x-black': IsOdd(index) }
            )}
          >
            {item.toLowerCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
