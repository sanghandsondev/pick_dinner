interface PickDinnerButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export default function PickDinnerButton({
  disabled,
  onClick,
}: PickDinnerButtonProps) {
  return (
    <div className="pick-cta">
      <button
        type="button"
        className={`pick-cta__btn${disabled ? ' pick-cta__btn--disabled' : ''}`}
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
      >
        <span className="pick-cta__icon" aria-hidden>
          🎲
        </span>
        <span className="pick-cta__label">
          {disabled ? 'Đã chốt bữa tối' : 'Pick Dinner'}
        </span>
      </button>
    </div>
  );
}
