import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung chi tiết bài giảng hoặc mô tả...',
  height = 280,
}) => {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key';
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div className={styles.editorContainer}>
      <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={(newContent) => onChange(newContent)}
        init={{
          height: height,
          menubar: false,
          placeholder: placeholder,
          skin: isDarkMode ? 'oxide-dark' : 'oxide',
          content_css: isDarkMode ? 'dark' : 'default',
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image table code | removeformat help',
          content_style: isDarkMode
            ? 'body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; color: #f8fafc; background-color: #151d2a; line-height: 1.6; }'
            : 'body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; color: #0f172a; background-color: #ffffff; line-height: 1.6; }',
          branding: false,
          promotion: false,
          statusbar: true,
        }}
      />
    </div>
  );
};
