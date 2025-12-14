import { SetStateAction, useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface propsInterface {
  color: string;
  setColor: React.Dispatch<SetStateAction<string>>;
}

const ColorPicker = (prop: propsInterface) => {
  const { color = '#ff0000', setColor } = prop;

  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);

  const pickerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const adjustPosition = () => {
      if (pickerRef.current && buttonRef.current) {
        const pickerHeight = pickerRef.current.offsetHeight;
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // If not enough space below but enough space above, move picker to top
        if (spaceBelow < pickerHeight && spaceAbove > pickerHeight) {
          setPosition('top');
        } else {
          setPosition('bottom');
        }
      }
    };

    adjustPosition();
    window.addEventListener('resize', adjustPosition);
    return () => window.removeEventListener('resize', adjustPosition);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowColorPickerModal(false);
      }
    };

    if (showColorPickerModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPickerModal]);

  return (
    <div className='relative min-w-4 min-h-4 max-h-4'>
      <button
        ref={buttonRef}
        className='relative inline-block min-w-4 min-h-4 rounded-sm cursor-pointer focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)]'
        style={{ backgroundColor: color }}
        onClick={() => setShowColorPickerModal((prev) => !prev)}
      ></button>

      <div
        ref={pickerRef}
        className={`absolute left-0 z-[1000] transition-all duration-150 transform p-5 bg-white border border-black/20 rounded-lg ${position === 'top' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'} ${
          showColorPickerModal
            ? 'scale-y-100 opacity-100'
            : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className='flex items-center justify-center w-full flex-col gap-4'>
          <HexColorPicker
            color={color || '#ff0000'}
            onChange={(updatedColor) => setColor(updatedColor)}
          />
          <input
            type='text'
            className='bg-transparent caret-black  autofill:!text-black
              !text-black  w-full h-full text-base focus:outline-none focus:ring-0 py-1.5 px-1.5 font-inter resize-none disabled:bg-[#7fab98]/15 disabled:border disabled:border-[#7fab98] border border-black/20 rounded-md focus:border-[var(--them-pink-color)] focus:outline focus:outline-3 focus:outline-[rgba(215,139,159,0.2)]'
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
