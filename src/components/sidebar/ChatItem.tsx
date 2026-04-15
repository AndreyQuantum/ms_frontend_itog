import { useState, useRef, useEffect } from 'react';
import { IconChat, IconEdit, IconTrash } from '../../assets/icons';
import { ConfirmModal } from '../ui/ConfirmModal';
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

  return (
    <>
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
            className={styles.chatItemAction}
            onClick={() => setShowConfirm(true)}
            aria-label="Удалить чат"
            title="Удалить"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Удалить чат?"
          message={`Вы уверены, что хотите удалить чат «${title}»? Это действие нельзя отменить.`}
          confirmText="Удалить"
          onConfirm={() => {
            setShowConfirm(false);
            onDelete();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
