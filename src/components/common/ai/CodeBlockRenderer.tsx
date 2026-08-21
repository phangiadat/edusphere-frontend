import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './CodeBlockRenderer.module.css';

interface CodeBlockRendererProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CodeBlockRenderer: React.FC<CodeBlockRendererProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  // Render Inline Code Pill (e.g. `npm run dev`)
  if (inline || !match) {
    return (
      <code className={styles.inlineCode} {...props}>
        {children}
      </code>
    );
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      toast.success('Đã sao chép mã code!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Không thể sao chép code');
    }
  };

  return (
    <div className={styles.codeBlockContainer}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <span className={styles.langLabel}>
          <Code2 className="w-3.5 h-3.5" />
          {language || 'code'}
        </span>

        <button
          onClick={handleCopyCode}
          className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
          title="Sao chép mã nguồn"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đã sao chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighting Body */}
      <div className={styles.codeBody}>
        <SyntaxHighlighter
          language={language || 'typescript'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.8125rem',
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
