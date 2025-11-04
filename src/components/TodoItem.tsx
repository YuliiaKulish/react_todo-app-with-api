/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (todoId: Todo['id']) => void;
  onChangeTodo?: (todo: Todo) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onChangeTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  useEffect(() => {
    if (!isLoading && isEditing && todo.title === editedTitle.trim()) {
      setIsEditing(false);
    }
  }, [isLoading, todo.title]);

  const handleChangeCompleted = () => {
    const changedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    onChangeTodo?.(changedTodo);
  };

  const handleSubmit = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      onDelete?.(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const updatedTodo = { ...todo, title: trimmedTitle };

    onChangeTodo?.(updatedTodo);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeCompleted}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setEditedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
