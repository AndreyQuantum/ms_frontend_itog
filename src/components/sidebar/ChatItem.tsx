import { useState, useRef, useEffect } from 'react';
import styles from './sidebar.module.css';

interface ChatItemProps {
  id: string;
  title: string;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export function ChatItem({
  title,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== title) {
      onRename(trimmed);
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (showConfirm) {
      onDelete();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div
      className={`${styles.chatItem} ${isActive ? styles.chatItemActive : ''}`}
      onClick={!isEditing ? onSelect : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isEditing) onSelect();
      }}
    >
      <svg
        className={styles.chatItemIcon}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>

      {isEditing ? (
        <input
          ref={inputRef}
          className={styles.chatItemEditInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className={styles.chatItemTitle}>{title}</span>
      )}

      <div className={styles.chatItemActions} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.chatItemAction}
          onClick={() => {
            setEditValue(title);
            setIsEditing(true);
          }}
          aria-label="Переименовать"
          title="Переименовать"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className={`${styles.chatItemAction} ${showConfirm ? styles.chatItemActionDanger : ''}`}
          onClick={handleDelete}
          aria-label={showConfirm ? 'Подтвердить удаление' : 'Удалить'}
          title={showConfirm ? 'Нажмите ещё раз для подтверждения' : 'Удалить'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
