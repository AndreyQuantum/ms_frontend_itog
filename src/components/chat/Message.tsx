import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { Message as MessageType } from '../../types';
import { IconUser, IconRobot, IconCopy } from '../../assets/icons';
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
        {isUser ? <IconUser /> : <IconRobot />}
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
              <IconCopy />
              <span>Копировать</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
