import { IconRobot } from '../../assets/icons';
import styles from './chat.module.css';

export function TypingIndicator() {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingAvatar}>
        <IconRobot />
      </div>
      <div className={styles.typingDots}>
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
      </div>
    </div>
  );
}
