import React, { useRef } from 'react';
import {
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from 'react-icons/md';
import { Editor } from '@tiptap/react';
import tippy from 'tippy.js';

import './editor.css';

import { AiFillHighlight } from 'react-icons/ai';
import { FaBold, FaItalic, FaLink, FaStrikethrough } from 'react-icons/fa';
import { FaLinkSlash } from 'react-icons/fa6';
import { Instance } from 'tippy.js';

import { classNames } from '../../Helper/HelperFunctions';

interface RichTextEditorMenuProps {
  icon: React.ReactElement;
  onClick: () => void;
  isActive: boolean;
}

function MenuBar({ editor }: { editor: Editor | null }) {
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const tippyInstance = useRef<Instance | null>(null);

  if (!editor) return null;

  const handelSetLinkFunction = () => {
    if (!linkButtonRef.current) return;
    if (tippyInstance.current) {
      tippyInstance.current.destroy();
    }
    const previewUrl = editor?.getAttributes('link').href;
    let url = previewUrl || '';

    const popoverWrapper = document.createElement('div');
    popoverWrapper.className =
      'p-2 flex flex-col gap-2 shadow-xl min-w-[200px]';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = url;
    inputField.placeholder = 'Enter URL...';
    inputField.autofocus = true;
    inputField.className =
      'border border-black/45 bg-transparent rounded w-full text-black py-1 px-2 outline-0 resize-none focus:right-0 focus:outline-none focus:outline-2 focus:outline-[rgba(215,139,159,0.2)] focus:border-[var(--them-pink-color)] text-sm';

    const buttonWarper = document.createElement('div');
    buttonWarper.className =
      'w-full grid grid-cols-2 gap-3 border-t border-t-black/20 pt-2 items-center justify-center';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.className =
      'bg-[var(--them-green-color)] rounded text-white font-inter px-2 py-1 text-sm';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className =
      'bg-white border border-black/20 rounded text-black font-inter px-2 py-1 text-sm';

    buttonWarper.appendChild(submitButton);
    buttonWarper.appendChild(removeButton);

    popoverWrapper.appendChild(inputField);

    popoverWrapper.appendChild(buttonWarper);

    tippyInstance.current = tippy(linkButtonRef.current, {
      content: popoverWrapper,
      trigger: 'manual',
      interactive: true,
      placement: 'bottom',
      theme: 'light',
      arrow: false,
      onShow() {
        inputField.focus();
      },
    });

    // Show the popover
    tippyInstance.current.show();

    // Handle apply action
    const handleApply = () => {
      url = inputField.value.trim();

      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        try {
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        } catch (e) {
          console.error(e);
        }
      }
      tippyInstance.current?.hide();
    };

    // Handle remove action
    const handleRemove = () => {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      tippyInstance.current?.hide();
    };

    // Handle key events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleApply();
      } else if (e.key === 'Escape') {
        tippyInstance.current?.hide();
      }
    };

    inputField.addEventListener('keydown', handleKeyDown);
    submitButton.addEventListener('click', handleApply);
    removeButton.addEventListener('click', handleRemove);

    // Cleanup event listeners when popover is hidden
    const cleanUp = () => {
      inputField.removeEventListener('keydown', handleKeyDown);
      submitButton.removeEventListener('click', handleApply);
      removeButton.removeEventListener('click', handleRemove);
    };

    tippyInstance.current.setProps({
      onHidden() {
        cleanUp();
        tippyInstance.current?.destroy();
        tippyInstance.current = null;
      },
    });
  };

  const menuItems: RichTextEditorMenuProps[] = [
    {
      icon: <FaBold className='text-lg' />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: <FaItalic className='text-lg' />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: <FaStrikethrough className='text-lg' />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: <AiFillHighlight className='text-lg' />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
    },
    {
      icon: <MdFormatAlignLeft className='text-lg' />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <MdFormatAlignCenter className='text-lg' />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <MdFormatAlignRight className='text-lg' />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <MdFormatAlignJustify className='text-lg' />,
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
    },
  ];

  return (
    <div className='control-group'>
      <div className='button-group flex flex-wrap gap-2 border-b border-b-black/20 p-2 rounded-t-lg'>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={classNames(
              'p-2 border border-black/20 rounded-md transition-all',
              {
                'bg-black text-white': item?.isActive,
                'hover:bg-black/10': !item?.isActive,
              }
            )}
          >
            {item.icon}
          </button>
        ))}
        <button
          ref={linkButtonRef}
          onClick={handelSetLinkFunction}
          className={classNames(
            'p-2 border border-black/20 rounded-md transition-all',
            {
              'bg-black text-white': editor.isActive('link'),
              'hover:bg-black/10': !editor.isActive('link'),
            }
          )}
        >
          <FaLink className='text-lg' />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={classNames(
            'p-2 border border-black/20 rounded-md transition-all',
            {
              'hover:bg-black/10': false,
            }
          )}
        >
          <FaLinkSlash className='text-lg' />
        </button>
      </div>
    </div>
  );
}

export default MenuBar;
