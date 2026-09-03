import { useEffect, useMemo, useState } from "react";
import type { Meal, MealCategory } from "../types";

interface MealsManagerModalProps {
  open: boolean;
  meals: Meal[];
  onClose: () => void;
  onAdd: (name: string, category: MealCategory) => void;
  onUpdate: (id: string, patch: { name?: string }) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, delta: -1 | 1) => void;
}

export default function MealsManagerModal({
  open,
  meals,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
}: MealsManagerModalProps) {
  const [tab, setTab] = useState<MealCategory>("rice");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset transient state when modal closes.
  useEffect(() => {
    if (!open) {
      setNewName("");
      setEditingId(null);
      setEditingName("");
    }
  }, [open]);

  const counts = useMemo(
    () => ({
      rice: meals.filter((m) => m.category === "rice").length,
      other: meals.filter((m) => m.category === "other").length,
    }),
    [meals],
  );

  const shown = useMemo(
    () => meals.filter((m) => m.category === tab),
    [meals, tab],
  );

  if (!open) return null;

  const commitEdit = () => {
    if (editingId === null) return;
    const trimmed = editingName.trim();
    if (trimmed) onUpdate(editingId, { name: trimmed });
    setEditingId(null);
    setEditingName("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed, tab);
    setNewName("");
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Manage meals"
      onClick={onClose}
    >
      <div
        className="modal-card modal-card--manager"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-card__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="manager__header">
          <div className="modal-card__eyebrow">Meals</div>
          <h2 className="manager__title">Edit your meal list</h2>
        </div>

        <div className="meal-list__tabs manager__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "rice"}
            className={`meal-tab${tab === "rice" ? " meal-tab--active" : ""}`}
            onClick={() => setTab("rice")}
          >
            <span className="meal-tab__label">🍚 Rice</span>
            <span className="meal-tab__count">{counts.rice}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "other"}
            className={`meal-tab${tab === "other" ? " meal-tab--active" : ""}`}
            onClick={() => setTab("other")}
          >
            <span className="meal-tab__label">Other</span>
            <span className="meal-tab__count">{counts.other}</span>
          </button>
        </div>

        {shown.length === 0 ? (
          <div className="manager__empty">
            No meals in this category yet. Add one below.
          </div>
        ) : (
          <ul className="manager__list">
            {shown.map((meal, idx) => {
              const isEditing = editingId === meal.id;
              const isFirst = idx === 0;
              return (
                <li key={meal.id} className="manager__row">
                  {isEditing ? (
                    <input
                      className="manager__input manager__input--edit"
                      value={editingName}
                      autoFocus
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitEdit();
                        } else if (e.key === "Escape") {
                          setEditingId(null);
                          setEditingName("");
                        }
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className="manager__name"
                      onClick={() => {
                        setEditingId(meal.id);
                        setEditingName(meal.name);
                      }}
                      aria-label={`Edit ${meal.name}`}
                    >
                      {meal.name}
                    </button>
                  )}

                  <button
                    type="button"
                    className="manager__move"
                    onClick={() => onMove(meal.id, -1)}
                    disabled={isFirst || isEditing}
                    aria-label={`Move ${meal.name} up`}
                    title="Move up"
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    className="manager__delete"
                    onClick={() => {
                      if (confirm(`Delete "${meal.name}"?`)) onDelete(meal.id);
                    }}
                    disabled={isEditing}
                    aria-label={`Delete ${meal.name}`}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <form className="manager__add" onSubmit={handleAdd}>
          <input
            className="manager__input"
            placeholder={`Add ${tab === "rice" ? "rice" : "other"} meal…`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            aria-label="New meal name"
          />
          <button
            type="submit"
            className="btn btn--primary manager__add-btn"
            disabled={!newName.trim()}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
