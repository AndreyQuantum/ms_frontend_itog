import { IconAlert } from '../../assets/icons';
import styles from './ui.module.css';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className={styles.errorMessage} role="alert">
      <IconAlert />
      <span>{message}</span>
      {onDismiss && (
        <button className={styles.errorDismiss} onClick={onDismiss} aria-label="Закрыть">
          ✕
        </button>
      )}
    </div>
  );
}
