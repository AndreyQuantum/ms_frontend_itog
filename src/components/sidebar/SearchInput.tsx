import styles from './sidebar.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className={styles.searchWrapper}>
      <svg
        className={styles.searchIcon}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Поиск чатов…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchInput}
        id="chat-search-input"
      />
      {value && (
        <button
          className={styles.searchClear}
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
        >
          ✕
        </button>
      )}
    </div>
  );
}
