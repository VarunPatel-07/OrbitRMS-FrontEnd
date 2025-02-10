import clsx from 'clsx';

import { TextAreaProps } from '../interface/propsInterface';

function TextArea(props: TextAreaProps) {
  const { name, className } = props;
  return (
    <div className='w-full'>
      <textarea
        name={name}
        className={clsx('border border-black/65', className)}
      ></textarea>
    </div>
  );
}

export default TextArea;
