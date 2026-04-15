import styles from './ui.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  const toggleId = id ?? `toggle-${label?.replace(/\s/g, '-')}`;

  return (
    <label className={styles.toggle} htmlFor={toggleId}>
      <input
        id={toggleId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.toggleInput}
      />
      <span className={styles.toggleTrack}>
        <span className={styles.toggleThumb} />
      </span>
      {label && <span className={styles.toggleLabel}>{label}</span>}
    </label>
  );
}
