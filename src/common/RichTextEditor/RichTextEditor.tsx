import { useEffect } from 'react';
import { FaStarOfLife } from 'react-icons/fa';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, mergeAttributes, useEditor } from '@tiptap/react';

import { RichTextEditorInterface } from '../../interface/propsInterface';
import MenuBar from './MenuBar';
import { mentionSuggestion } from './RichTextEditorMentions/Suggestions';

function RichTextEditor(props: RichTextEditorInterface) {
  const {
    labelFieldName,
    isRequiredField,
    handelApiCallingFunction,
    GlobalStateProvider,
    handelOnUpdateFunction,
    showError,
    errorMessage,
    onEditorReady,
    feedContent,
    classNames,
    height,
    showMenuBar,
    disabled,
  } = props;

  const editorDefaultExtensionsArray = [
    Highlight,
    Document,
    Paragraph,
    Text,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Italic.configure({
      HTMLAttributes: { class: 'italic' },
    }),
    Bold.configure({
      HTMLAttributes: { class: 'font-bold' },
    }),
    Strike.configure({
      HTMLAttributes: { class: 'line-through' },
    }),
    Link.configure({
      autolink: true,
      openOnClick: true,
      defaultProtocol: 'https',
      linkOnPaste: true,
      protocols: [
        'https',
        'ftp',
        'mailto',
        { scheme: 'tel', optionalSlashes: true },
      ],
      isAllowedUri: (url, ctx) => {
        try {
          const parsedUrl = url.includes(':')
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`);
          if (!ctx.defaultValidate(parsedUrl.href)) return false;

          const disallowedProtocols = ['ftp', 'file', 'mailto'];
          const protocol = parsedUrl.protocol.replace(':', '');
          if (disallowedProtocols.includes(protocol)) return false;

          const allowedProtocols = ctx.protocols.map((p) =>
            typeof p === 'string' ? p : p.scheme
          );
          if (!allowedProtocols.includes(protocol)) return false;

          const disallowedDomains = [
            'example-phishing.com',
            'malicious-site.net',
          ];
          if (disallowedDomains.includes(parsedUrl.hostname)) return false;

          return true;
        } catch {
          return false;
        }
      },
      shouldAutoLink: (url) => {
        try {
          const parsedUrl = url.includes(':')
            ? new URL(url)
            : new URL(`https://${url}`);
          const disallowedDomains = [
            'example-no-autolink.com',
            'another-no-autolink.com',
          ];
          return !disallowedDomains.includes(parsedUrl.hostname);
        } catch {
          return false;
        }
      },
      HTMLAttributes: {
        class:
          'text-blue-500 underline hover:text-blue-600 transition-colors duration-200 cursor-pointer',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
  ];

  if (handelApiCallingFunction) {
    editorDefaultExtensionsArray.push(
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: mentionSuggestion(handelApiCallingFunction),
        renderHTML({ options, node }) {
          return [
            'span',
            mergeAttributes(
              {
                onclick: `window.open('/${GlobalStateProvider?.organization?.general_info?.portal_slug}/employees/employee-profile/${node.attrs.id}/employee-details', '_blank')`,
              },
              options.HTMLAttributes
            ),
            `${options.suggestion.char}${node.attrs.label ?? node.attrs.label}`,
          ];
        },
      })
    );
  }
  const editor = useEditor({
    extensions: editorDefaultExtensionsArray,
    editorProps: {
      attributes: {
        class: `text-black rounded-lg px-3 py-1.5 outline-none min-h-[${height || 350}px] rounded-t-none border-t-0 outline-t-none`,
      },
    },
    onUpdate: ({ editor }) => {
      const _data = editor.getHTML();
      handelOnUpdateFunction(_data);
    },
  });

  useEffect(() => {
    if (!editor || !feedContent) return;

    const currentContent = editor.getHTML();
    if (currentContent !== feedContent) {
      editor.commands.setContent(feedContent);
    }
  }, [feedContent, editor]);

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <>
      <div className='w-full'>
        {labelFieldName && (
          <label
            htmlFor=''
            className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
          >
            <span className='flex gap-1'>
              <span>{labelFieldName}</span>
              {isRequiredField && (
                <FaStarOfLife className='w-1.5 text-red-700' />
              )}
            </span>
          </label>
        )}
        <div
          className={`tiptap rounded-lg ${classNames}`}
          style={{
            border:
              showError && errorMessage
                ? '1px solid red'
                : '1px solid rgb(0,0,0,0.2)',
          }}
        >
          {showMenuBar && <MenuBar editor={editor} />}
          <div className='relative'>
            <EditorContent
              editor={editor}
              height={height}
              disabled={disabled}
              className='disabled:bg-[#7fab98]/15 disabled:border disabled:border-[#7fab98]disabled:cursor-not-allowed'
            />
          </div>
        </div>
        {showError && errorMessage && (
          <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
            {errorMessage}
          </span>
        )}
      </div>
    </>
  );
}

export default RichTextEditor;
