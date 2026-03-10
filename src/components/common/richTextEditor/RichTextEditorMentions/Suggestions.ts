/* eslint-disable @typescript-eslint/no-explicit-any */
import { RichTextEditorApiCallIngReturnInterface } from '@/interface/ComponentProps.interface';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

import MentionList from '@/components/common/richTextEditor/RichTextEditorMentions/Mentions';

export const mentionSuggestion = (
  fetchMentions: (
    query: string
  ) => Promise<RichTextEditorApiCallIngReturnInterface[]>
) => {
  return {
    char: '@',
    startOfLine: false,

    items: async ({ query }: { query: string }) => {
      try {
        if (query?.length <= 2)
          return [
            {
              success: false,
              message: 'Enter at least 3 words to search.',
              id: '',
              label: '',
              employeeCode: '',
            },
          ];

        const data = await fetchMentions(query);

        return data.map((item) => ({
          success: item?.success,
          id: item.id,
          label: item.label,
          employeeCode: item?.employeeCode,
          message: item?.message,
        }));
      } catch (error: any) {
        console.error(error);
        return [];
      }
    },

    // ✅ render stays the same
    render: () => {
      let component: any;
      let popup: any;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) return;

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            theme: 'light',
            arrow: false,
          });
        },
        onUpdate(props: any) {
          component.updateProps(props);

          if (!props.clientRect) return;

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },
        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },
        onExit() {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },
  };
};
