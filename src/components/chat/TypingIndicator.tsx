import styles from './chat.module.css';

export function TypingIndicator() {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingAvatar}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="url(#typing-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="typing-grad" x1="2" y1="2" x2="22" y2="22">
              <stop stopColor="#667eea" />
              <stop offset="1" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={styles.typingDots}>
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
      </div>
    </div>
  );
}
