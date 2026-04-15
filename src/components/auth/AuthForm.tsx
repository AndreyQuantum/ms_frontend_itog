import { useState } from 'react';
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
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="url(#auth-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="auth-grad" x1="2" y1="2" x2="22" y2="22">
                <stop stopColor="#667eea" />
                <stop offset="1" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
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
