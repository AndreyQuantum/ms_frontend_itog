import { useState, useRef, useEffect } from 'react';
import { IconChat, IconEdit, IconTrash } from '../../assets/icons';
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
      <IconChat className={styles.chatItemIcon} />

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
          <IconEdit />
        </button>
        <button
          className={`${styles.chatItemAction} ${showConfirm ? styles.chatItemActionDanger : ''}`}
          onClick={handleDelete}
          aria-label={showConfirm ? 'Подтвердить удаление' : 'Удалить'}
          title={showConfirm ? 'Нажмите ещё раз для подтверждения' : 'Удалить'}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
}
