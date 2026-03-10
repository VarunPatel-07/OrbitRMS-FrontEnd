/* eslint-disable @typescript-eslint/no-explicit-any */
import { RichTextEditorApiCallIngReturnInterface } from '@/interface/ComponentProps.interface';

import '@/components/common/RichTextEditor/editor.css';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface MentionListProps {
  items: RichTextEditorApiCallIngReturnInterface[];
  command: (props: {
    id: string;
    label?: string;
    employeeCode?: string;
  }) => void;
}
const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    if (!props.items || index < 0 || index >= props.items.length) return;

    const item = props.items[index];

    if (item && item?.success) {
      props.command({
        id: item.id,
        label: item.label,
        employeeCode: item?.employeeCode,
      });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: any }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  return (
    <div className='dropdown-menu w-full flex flex-col items-start justify-start overflow-hidden rounded-lg'>
      {props.items.length ? (
        props.items.map(
          (item: RichTextEditorApiCallIngReturnInterface, index: number) =>
            item?.success ? (
              <button
                className={`text-black w-full text-start px-3.5 py-1.5 text-sm capitalize ${props.items.length == index + 1 ? '' : 'border-b border-b-black/15'} ${index === selectedIndex ? 'bg-black/15' : 'hover:bg-black/5'}`}
                key={index}
                onClick={() => selectItem(index)}
              >
                {item?.label}
                <span
                  dangerouslySetInnerHTML={{ __html: item?.employeeCode }}
                  className='pl-1'
                ></span>
              </button>
            ) : (
              <span
                className='text-black w-full text-start px-3.5 py-1.5 text-sm capitalize'
                key={index}
              >
                {item?.message}
              </span>
            )
        )
      ) : (
        <span className='text-black w-full text-start px-3.5 py-1.5 text-sm capitalize'>
          No matches found.
        </span>
      )}
    </div>
  );
});

export default MentionList;
