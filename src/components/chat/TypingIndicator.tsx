import styles from './chat.module.css';

export function TypingIndicator() {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingAvatar}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
