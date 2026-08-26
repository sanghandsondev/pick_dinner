import { useEffect } from "react";
import type { HistoryEntry } from "../hooks/usePickHistory";

interface HistoryModalProps {
  open: boolean;
  entries: HistoryEntry[];
  onClose: () => void;
  onClear: () => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDealtAt(iso: string): { day: string; time: string } {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: "", time: "" };
  const day = `${WEEKDAYS[d.getDay()]} • ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return { day, time: `${hh}:${mm}` };
}

export default function HistoryModal({
  open,
  entries,
  onClose,
  onClear,
}: HistoryModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.dealtAt).getTime() - new Date(a.dealtAt).getTime(),
  );

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Pick history"
      onClick={onClose}
    >
      <div
        className="modal-card modal-card--history"
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

        <div className="history-modal__header">
          <div className="modal-card__eyebrow">History</div>
          <h2 className="history-modal__title">Your past dinners</h2>
          <div className="history-modal__meta">
            {sorted.length} {sorted.length === 1 ? "entry" : "entries"}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="history-modal__empty">
            <div className="history-modal__empty-emoji" aria-hidden>
              🍽️
            </div>
            <div className="history-modal__empty-title">No history yet</div>
            <div className="history-modal__empty-hint">
              Deal a dinner and it will show up here.
            </div>
          </div>
        ) : (
          <>
            <ul className="history-list">
              {sorted.map((entry) => {
                const { day, time } = formatDealtAt(entry.dealtAt);
                return (
                  <li key={entry.id} className="history-item">
                    <div className="history-item__body">
                      <div className="history-item__name">{entry.mealName}</div>
                      <div className="history-item__date">
                        <span>{day}</span>
                        <span className="history-item__dot" aria-hidden>
                          •
                        </span>
                        <span>{time}</span>
                      </div>
                    </div>
                    <div className="history-item__emojis" aria-hidden>
                      {entry.emojis.map((e, i) => (
                        <span key={i}>{e}</span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="history-modal__actions">
              <button
                type="button"
                className="btn btn--secondary history-modal__clear"
                onClick={() => {
                  if (confirm("Clear all history?")) onClear();
                }}
              >
                Clear history
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
