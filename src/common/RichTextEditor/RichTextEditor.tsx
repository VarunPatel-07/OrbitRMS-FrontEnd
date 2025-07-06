/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Editor,
  EditorContent,
  mergeAttributes,
  useEditor,
} from '@tiptap/react';

import { RichTextEditorInterface } from '../../interface/propsInterface';
import MenuBar from './MenuBar';
import { mentionSuggestion } from './RichTextEditorMentions/Suggestions';

export const clearEditor = (editor: Editor) => {
  editor?.commands.clearContent();
};

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
  } = props;
  const editor = useEditor({
    extensions: [
      Highlight,
      Document,
      Paragraph,
      Text,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Italic.configure({
        HTMLAttributes: {
          class: 'italic',
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
      Strike.configure({
        HTMLAttributes: {
          class: 'line-through',
        },
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
          {
            scheme: 'tel',
            optionalSlashes: true,
          },
        ],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto'];
            const protocol = parsedUrl.protocol.replace(':', '');

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === 'string' ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              'example-phishing.com',
              'malicious-site.net',
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              'example-no-autolink.com',
              'another-no-autolink.com',
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
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
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: mentionSuggestion(handelApiCallingFunction),
        renderHTML({ options, node }) {
          return [
            'a',
            mergeAttributes(
              {
                href: `/${GlobalStateProvider?.organization?.general_info?.portal_slug}/employee-profile/${node.attrs.id}/employee-details`,
                target: '_blank',
              },
              options.HTMLAttributes
            ),

            `${options.suggestion.char}${node.attrs.label ?? node.attrs.label}`,
          ];
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'text-black rounded-lg px-3 py-1.5 outline-none min-h-[350px] rounded-t-none border-t-0 outline-t-none',
      },
    },
    onUpdate: ({ editor }) => {
      const _data = editor.getHTML();
      handelOnUpdateFunction(JSON.stringify(_data));
    },
  });

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
          className='tiptap rounded-lg'
          style={{
            border:
              showError && errorMessage
                ? '1px solid red'
                : '1px solid rgb(0,0,0,0.2)',
          }}
        >
          <MenuBar editor={editor} />
          <div className='relative'>
            <EditorContent editor={editor} />
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
