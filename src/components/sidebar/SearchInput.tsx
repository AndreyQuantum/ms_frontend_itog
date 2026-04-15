import { IconSearch } from '../../assets/icons';
import styles from './sidebar.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className={styles.searchWrapper}>
      <IconSearch className={styles.searchIcon} />
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
