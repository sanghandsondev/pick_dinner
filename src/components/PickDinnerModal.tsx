import { useEffect, useRef, useState } from "react";
import type { Meal } from "../types";

interface PickDinnerModalProps {
  open: boolean;
  meals: Meal[];
  onClose: () => void;
  onDeal: (meal: Meal) => void;
}

const SPIN_MS = 2000;
const TICK_MS = 90;

export default function PickDinnerModal({
  open,
  meals,
  onClose,
  onDeal,
}: PickDinnerModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [displayMeal, setDisplayMeal] = useState<Meal | null>(null);
  const [resultMeal, setResultMeal] = useState<Meal | null>(null);

  const tickTimer = useRef<number | null>(null);
  const stopTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (tickTimer.current !== null) {
      window.clearInterval(tickTimer.current);
      tickTimer.current = null;
    }
    if (stopTimer.current !== null) {
      window.clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
  };

  const pickRandomMeal = (exclude?: Meal | null): Meal => {
    if (meals.length <= 1) return meals[0];
    let next = meals[Math.floor(Math.random() * meals.length)];
    // Tránh trùng với món hiện tại để cảm giác "đổi" rõ hơn.
    let guard = 0;
    while (exclude && next.id === exclude.id && guard < 8) {
      next = meals[Math.floor(Math.random() * meals.length)];
      guard += 1;
    }
    return next;
  };

  const startSpin = () => {
    if (meals.length === 0) return;
    clearTimers();
    setSpinning(true);
    setResultMeal(null);

    tickTimer.current = window.setInterval(() => {
      setDisplayMeal((prev) => pickRandomMeal(prev));
    }, TICK_MS);

    stopTimer.current = window.setTimeout(() => {
      if (tickTimer.current !== null) {
        window.clearInterval(tickTimer.current);
        tickTimer.current = null;
      }
      const final = pickRandomMeal(null);
      setDisplayMeal(final);
      setResultMeal(final);
      setSpinning(false);
    }, SPIN_MS);
  };

  // Khi modal mở → tự start spin.
  useEffect(() => {
    if (open) {
      startSpin();
    } else {
      clearTimers();
      setSpinning(false);
      setResultMeal(null);
      setDisplayMeal(null);
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Đóng bằng phím ESC.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !spinning) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, spinning, onClose]);

  if (!open) return null;

  const shownMeal = displayMeal ?? meals[0];

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Pick dinner"
      onClick={() => {
        if (!spinning) onClose();
      }}
    >
      <div
        className={`modal-card${spinning ? " modal-card--spinning" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-card__close"
          onClick={onClose}
          disabled={spinning}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="modal-card__eyebrow">
          {spinning ? "Picking…" : "Your dinner"}
        </div>

        <div className="modal-card__stage" aria-live="polite">
          <div
            className={`modal-card__meal${spinning ? " modal-card__meal--rolling" : ""}`}
            key={shownMeal?.id}
          >
            {shownMeal?.name ?? "—"}
          </div>
          {spinning && <div className="modal-card__spinner" aria-hidden />}
        </div>

        <div className="modal-card__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={startSpin}
            disabled={spinning}
          >
            Pick Again
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => resultMeal && onDeal(resultMeal)}
            disabled={spinning || !resultMeal}
          >
            Deal
          </button>
        </div>
      </div>
    </div>
  );
}
