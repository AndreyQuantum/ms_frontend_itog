import { useState, useMemo } from 'react';
import { IconCopy, IconCheck } from '../../assets/icons';
import hljs from 'highlight.js';
import styles from './chat.module.css';

interface CodeBlockProps {
  language: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    try {
      if (hljs.getLanguage(language)) {
        return hljs.highlight(children, { language }).value;
      }
      return hljs.highlightAuto(children).value;
    } catch {
      return children;
    }
  }, [children, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeBlockHeader}>
        <span className={styles.codeBlockLang}>{language}</span>
        <button className={styles.codeBlockCopy} onClick={handleCopy}>
          {copied ? (
            <>
              <IconCheck />
              Скопировано
            </>
          ) : (
            <>
              <IconCopy />
              Копировать
            </>
          )}
        </button>
      </div>
      <pre className={styles.codeBlockPre}>
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
