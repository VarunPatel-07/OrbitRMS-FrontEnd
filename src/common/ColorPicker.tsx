import { SetStateAction, useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({
  color,
  setColor,
}: {
  color: string;
  setColor: React.Dispatch<SetStateAction<string>>;
}) => {
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
        className={`absolute left-0 z-10 transition-all duration-75 transform ${position === 'top' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'} ${
          showColorPickerModal
            ? 'scale-y-100 opacity-100'
            : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <SketchPicker
          color={color}
          onChange={(updatedColor) => setColor(updatedColor.hex)}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
