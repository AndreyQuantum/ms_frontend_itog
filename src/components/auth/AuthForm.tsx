import { useState } from 'react';
import { IconLogo } from '../../assets/icons';
import styles from './auth.module.css';

interface AuthFormProps {
  onSubmit: (apiKey: string) => void;
}

export function AuthForm({ onSubmit }: AuthFormProps) {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className={styles.authOverlay}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <div className={styles.authIcon}>
          <IconLogo width={40} height={40} />
        </div>
        <h2 className={styles.authTitle}>Введите API ключ</h2>
        <p className={styles.authDescription}>
          Для работы необходим ключ Gemini API
        </p>
        <input
          type="password"
          className={styles.authInput}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="AIza..."
          autoFocus
          id="api-key-input"
        />
        <button type="submit" className={styles.authButton} disabled={!key.trim()}>
          Начать
        </button>
      </form>
    </div>
  );
}
