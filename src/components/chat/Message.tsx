import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { Message as MessageType } from '../../types';
import { CodeBlock } from './CodeBlock';
import styles from './chat.module.css';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`${styles.message} ${isUser ? styles.messageUser : styles.messageAssistant}`}
    >
      <div className={styles.messageAvatar}>
        {isUser ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <div className={styles.messageContent}>
        <div className={styles.messageRole}>{isUser ? 'Вы' : 'AI'}</div>
        <div className={styles.messageBody}>
          {isUser ? (
            <p className={styles.messageText}>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}

              components={{
                code: (props: ComponentPropsWithoutRef<'code'>) => {
                  const { children, className, ...rest } = props;
                  const match = /language-(\w+)/.exec(className ?? '');
                  const isInline = !match;

                  if (isInline) {
                    return (
                      <code className={styles.inlineCode} {...rest}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock language={match[1]}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  );
                },
                p: ({ children }) => <p className={styles.markdownP}>{children}</p>,
                ul: ({ children }) => <ul className={styles.markdownUl}>{children}</ul>,
                ol: ({ children }) => <ol className={styles.markdownOl}>{children}</ol>,
                li: ({ children }) => <li className={styles.markdownLi}>{children}</li>,
                h1: ({ children }) => <h1 className={styles.markdownH}>{children}</h1>,
                h2: ({ children }) => <h2 className={styles.markdownH}>{children}</h2>,
                h3: ({ children }) => <h3 className={styles.markdownH}>{children}</h3>,
                table: ({ children }) => (
                  <div className={styles.tableWrapper}>
                    <table className={styles.markdownTable}>{children}</table>
                  </div>
                ),
                blockquote: ({ children }) => (
                  <blockquote className={styles.markdownBlockquote}>{children}</blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && message.content && (
          <div className={styles.messageActions}>
            <button
              className={styles.messageAction}
              onClick={() => navigator.clipboard.writeText(message.content)}
              title="Копировать"
              aria-label="Копировать ответ"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Копировать</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
