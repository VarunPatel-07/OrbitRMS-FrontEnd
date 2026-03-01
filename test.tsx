import { forwardRef } from 'react';

import DatePicker from 'react-datepicker';

import clsx from 'clsx';

import 'react-datepicker/dist/react-datepicker.css';

import { FaCalendarAlt, FaStarOfLife } from 'react-icons/fa';

// Inject custom styles once
const STYLES = `
  /* ── Popper wrapper ── */
  .cdp-popper { z-index: 9999; }

  /* ── Calendar container ── */
  .cdp-calendar.react-datepicker {
    font-family: 'DM Sans', sans-serif;
    border: none;
    border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
    overflow: hidden;
    background: #ffffff;
    padding: 0;
  }

  /* ── Header ── */
  .cdp-calendar .react-datepicker__header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-bottom: none;
    padding: 18px 16px 14px;
    border-radius: 0;
  }

  .cdp-calendar .react-datepicker__current-month {
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    margin-bottom: 14px;
  }

  .cdp-calendar .react-datepicker__day-names {
    display: flex;
    justify-content: space-around;
    margin: 0;
  }

  .cdp-calendar .react-datepicker__day-name {
    color: rgba(255,255,255,0.5);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    width: 36px;
    line-height: 1;
    margin: 0;
  }

  /* ── Nav arrows ── */
  .cdp-calendar .react-datepicker__navigation {
    top: 16px;
  }
  .cdp-calendar .react-datepicker__navigation--previous { left: 14px; }
  .cdp-calendar .react-datepicker__navigation--next    { right: 14px; }

  .cdp-calendar .react-datepicker__navigation-icon::before {
    border-color: rgba(255,255,255,0.7);
    border-width: 2px 2px 0 0;
    width: 8px;
    height: 8px;
  }
  .cdp-calendar .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #ffffff;
  }

  /* ── Month body ── */
  .cdp-calendar .react-datepicker__month {
    margin: 10px 12px 14px;
  }

  .cdp-calendar .react-datepicker__week {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2px;
  }

  /* ── Day cells ── */
  .cdp-calendar .react-datepicker__day {
    width: 36px;
    height: 36px;
    line-height: 36px;
    border-radius: 50%;
    margin: 1px 0;
    font-size: 13.5px;
    font-weight: 500;
    color: #1a1a2e;
    transition: background 0.15s, color 0.15s, transform 0.1s;
  }
  .cdp-calendar .react-datepicker__day:hover {
    background: #e8f4ff;
    color: #1a73e8;
    border-radius: 50%;
    transform: scale(1.08);
  }

  /* ── Selected (start / end) ── */
  .cdp-calendar .react-datepicker__day--selected,
  .cdp-calendar .react-datepicker__day--range-start,
  .cdp-calendar .react-datepicker__day--range-end {
    background: linear-gradient(135deg, #1a73e8, #0d47a1) !important;
    color: #ffffff !important;
    border-radius: 50% !important;
    font-weight: 700;
    box-shadow: 0 3px 10px rgba(26,115,232,0.4);
  }

  /* ── In-range days ── */
  .cdp-calendar .react-datepicker__day--in-range,
  .cdp-calendar .react-datepicker__day--in-selecting-range {
    background: #dbeafe !important;
    color: #1a1a2e !important;
    border-radius: 0 !important;
  }
  .cdp-calendar .react-datepicker__day--range-start,
  .cdp-calendar .react-datepicker__day--in-selecting-range:first-child {
    border-radius: 50% 0 0 50% !important;
  }
  .cdp-calendar .react-datepicker__day--range-end {
    border-radius: 0 50% 50% 0 !important;
  }
  /* single day selected with no range */
  .cdp-calendar .react-datepicker__day--selected:not(.react-datepicker__day--in-range) {
    border-radius: 50% !important;
  }

  /* ── Disabled days ── */
  .cdp-calendar .react-datepicker__day--disabled {
    color: #d1d5db !important;
    cursor: not-allowed;
    background: transparent !important;
  }
  .cdp-calendar .react-datepicker__day--disabled:hover {
    transform: none;
  }

  /* ── Today ── */
  .cdp-calendar .react-datepicker__day--today {
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* ── Year dropdown ── */
  .cdp-calendar .react-datepicker__year-dropdown {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    width: 90px;
    left: 50%;
    transform: translateX(-50%);
  }
  .cdp-calendar .react-datepicker__year-option:hover {
    background: #f0f7ff;
    color: #1a73e8;
  }
  .cdp-calendar .react-datepicker__year-option--selected_year {
    background: #1a73e8;
    color: #fff;
    font-weight: 700;
  }
  .cdp-calendar .react-datepicker__year-read-view--selected-year {
    color: rgba(255,255,255,0.9);
    font-weight: 600;
    font-size: 13px;
  }
  .cdp-calendar .react-datepicker__year-read-view--down-arrow {
    border-color: rgba(255,255,255,0.7);
    border-width: 2px 2px 0 0;
    width: 7px;
    height: 7px;
    top: 3px;
  }
  .cdp-calendar .react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow {
    border-color: #fff;
  }

  /* ── Triangle ── */
  .cdp-calendar .react-datepicker__triangle { display: none; }
`;

if (typeof document !== 'undefined' && !document.getElementById('cdp-styles')) {
  const el = document.createElement('style');
  el.id = 'cdp-styles';
  el.textContent = STYLES;
  document.head.appendChild(el);
}

// ─────────────────────────────────────────────────────────────────────────────
// Two-months-ago minimum date helper
// ─────────────────────────────────────────────────────────────────────────────
function getTwoMonthsAgo(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// Props interface (extend your existing one or replace inline)
// ─────────────────────────────────────────────────────────────────────────────
interface CommonDatePickerProps {
  onChange: (date: Date | null) => void;
  selectedValue: Date | null;
  className?: string;
  labelFieldName?: string;
  isRequiredField?: boolean;
  datePickerPosition?: any;
  showError?: boolean;
  errorMessage?: string;
  year?: number;
  maxDate?: Date;
  disabled?: boolean;
  /** For range UI — the other bound */
  startDate?: Date | null;
  endDate?: Date | null;
  /** Is this picking the end date? Opens calendar at startDate if provided */
  isEndDate?: boolean;
}

function CommonDatePicker(props: CommonDatePickerProps) {
  const {
    onChange,
    selectedValue,
    className,
    labelFieldName,
    isRequiredField,
    datePickerPosition = 'bottom-start',
    showError,
    errorMessage,
    year,
    maxDate,
    disabled = false,
    startDate,
    endDate,
    isEndDate = false,
  } = props;

  // Min date: 2 months ago
  const minDate = getTwoMonthsAgo();

  // End date picker opens at startDate (so user sees the selected start)
  const openToDate =
    isEndDate && startDate
      ? new Date(startDate)
      : year
        ? new Date(new Date().setFullYear(year))
        : selectedValue
          ? new Date(selectedValue)
          : new Date();

  const CustomInput = forwardRef(
    (
      { value, onClick }: { value?: string; onClick?: () => void },
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref}
        className={clsx(
          'relative w-full cursor-pointer rounded-xl bg-white flex items-center max-h-[44px] transition-all duration-200',
          'shadow-sm hover:shadow-md',
          className
        )}
        style={{
          border: disabled
            ? '1.5px solid #b0c4bc'
            : showError && errorMessage
              ? '1.5px solid #ef4444'
              : '1.5px solid #d1d5db',
          background: disabled ? '#f3f4f6' : '#ffffff',
        }}
        onClick={onClick}
      >
        <input
          type='text'
          value={value}
          readOnly
          placeholder='DD/MM/YYYY'
          className='w-full bg-transparent text-gray-800 placeholder-gray-400 focus:ring-0 focus:shadow-none focus:outline-none cursor-pointer text-sm disabled:cursor-not-allowed py-2.5 pl-4 pr-10 font-medium'
          disabled={disabled}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        <span
          className='absolute right-3 flex items-center justify-center w-6 h-6 rounded-md transition-colors duration-150'
          style={{
            color: disabled
              ? '#9ca3af'
              : showError && errorMessage
                ? '#ef4444'
                : '#1a73e8',
          }}
        >
          <FaCalendarAlt size={14} />
        </span>
      </div>
    )
  );

  return (
    <div className='w-full'>
      {labelFieldName?.trim() !== '' && labelFieldName && (
        <label
          htmlFor=''
          className='text-sm font-medium text-gray-600 pb-1.5 inline-block'
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <span className='flex gap-1 items-center'>
            <span>{labelFieldName}</span>
            {isRequiredField && <FaStarOfLife className='w-1.5 text-red-600' />}
          </span>
        </label>
      )}

      <DatePicker
        selected={selectedValue}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
        selectsEnd={isEndDate}
        selectsStart={!isEndDate}
        calendarClassName='cdp-calendar'
        popperClassName='cdp-popper'
        wrapperClassName='w-full'
        popperPlacement={datePickerPosition}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={10}
        dateFormat='dd/MM/yyyy'
        disabled={disabled}
        customInput={<CustomInput />}
        openToDate={openToDate}
      />

      {showError && errorMessage && (
        <span
          className='text-red-500 text-xs mt-1 block px-1'
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default CommonDatePicker;
