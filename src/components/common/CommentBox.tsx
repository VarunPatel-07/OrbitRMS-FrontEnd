import React, { useEffect, useRef, useState } from 'react';

interface Props {
  replyTo?: string; // example: 'Varun'
}

const CommentBox: React.FC<Props> = ({ replyTo }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const prefix = replyTo ? `@${replyTo} ` : '';

  useEffect(() => {
    // Pre-fill with @username only once when replying
    if (replyTo && text.trim() === '') {
      setText(prefix);
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) textarea.setSelectionRange(prefix.length, prefix.length);
      }, 0);
    }
  }, [replyTo]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Prevent deleting or editing prefix
    if (!newValue.startsWith(prefix)) {
      setText(prefix);
      return;
    }

    setText(newValue);
  };

  return (
    <textarea
      ref={textareaRef}
      className='border p-2 w-full rounded'
      rows={3}
      value={text}
      onChange={handleChange}
    />
  );
};

export default CommentBox;
