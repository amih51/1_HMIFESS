import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

/**
 * A component to edit text using Tiptap.
 *
 * @param {{ onChange: (value: string) => void }} props
 * The props of the component.
 * @param {function(string): void} props.onChange
 * The function to call when the text is changed.
 * @returns {JSX.Element}
 * The component.
 */
const TextUploader = ({ onChange }: { onChange: (value: string) => void }): JSX.Element => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: (
      { editor }: {
        editor: import('tiptap').Editor;
      }
    ): void => {
      onChange(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};

export default TextUploader;