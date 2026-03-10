import { FaStarOfLife } from 'react-icons/fa';

import clsx from 'clsx';

import { TextAreaProps } from '@/interface/ComponentProps.interface';

function TextArea(props: TextAreaProps) {
  const {
    name,
    className,
    cols,
    rows,
    value,
    setValue,
    onChange,
    isRequiredField,
    labelFieldName,
    showError,
    errorMessage,
    disabled,
  } = props;

  const handelOnChangeFunction = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    if (!setValue) return;
    setValue(val);
  };
  return (
    <div className='w-full'>
      {labelFieldName && (
        <label
          htmlFor=''
          className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
        >
          <span className='flex gap-1'>
            <span>{labelFieldName}</span>
            {isRequiredField && <FaStarOfLife className='w-1.5 text-red-700' />}
          </span>
        </label>
      )}
      <textarea
        name={name}
        className={clsx(
          'border border-black/45 bg-transparent rounded-lg w-full text-black p-2 outline-0 resize-none focus:right-0 focus:outline-none focus:outline-4 focus:outline-[rgba(215,139,159,0.2)] focus:border-[var(--them-pink-color)] disabled:border disabled:border-[#7fab98] disabled:bg-[#7fab98]/15 disabled:cursor-not-allowed',
          className
        )}
        disabled={disabled}
        cols={cols || 10}
        rows={rows || 5}
        value={value}
        onChange={setValue ? handelOnChangeFunction : onChange}
        style={{ border: showError && errorMessage ? '1px solid red' : '' }}
      ></textarea>
      {showError && errorMessage && (
        <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default TextArea;
