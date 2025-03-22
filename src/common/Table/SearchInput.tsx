import { IoIosSearch } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

function SearchInput({
  value,
  handelOnChange,
  handelCancelButton,
  handelKeyDown,
}: {
  value: string;
  handelOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handelCancelButton: () => void;
  handelKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div
      className='w-full h-full bg-white rounded-lg overflow-hidden border border-black/20 relative focus-within:outline-[3px] focus-within:outline-[rgba(215,139,159,0.2)] focus-within:border-[rgba(215,139,159,0.5)] focus-within:outline'
      onKeyDown={handelKeyDown}
    >
      <span className='inline-block absolute top-1/2 -translate-y-1/2 left-2.5'>
        <IoIosSearch className='text-black text-xl' />
      </span>
      <input
        type='search'
        className='w-full bg-transparent h-full border-0 outline-none right-0 focus:right-0 text-black rounded-lg pl-10'
        placeholder='Search Results....'
        value={value}
        onChange={handelOnChange}
        onKeyDown={handelKeyDown}
      />
      {value?.trim().length >= 1 && (
        <button
          className='inline-block absolute top-1/2 -translate-y-1/2 right-2.5 transition-all bg-transparent border-0'
          onClick={handelCancelButton}
        >
          <IoClose className='text-black text-xl' />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
