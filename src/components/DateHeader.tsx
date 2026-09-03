interface DateHeaderProps {
  date: Date;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenManager: () => void;
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

export default function DateHeader({
  date,
  historyCount,
  onOpenHistory,
  onOpenManager,
}: DateHeaderProps) {
  const weekday = WEEKDAYS[date.getDay()];
  const dateStr = `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  return (
    <header className="date-header">
      <div className="date-header__top">
        <div className="date-header__eyebrow">Tonight's dinner</div>
        <div className="date-header__actions">
          <button
            type="button"
            className="date-header__action"
            onClick={onOpenManager}
            aria-label="Edit meal list"
          >
            <span className="date-header__action-icon" aria-hidden>
              ✏️
            </span>
            <span className="date-header__action-label">Edit</span>
          </button>
          <button
            type="button"
            className="date-header__action"
            onClick={onOpenHistory}
            aria-label={`Open history (${historyCount} entries)`}
          >
            <span className="date-header__action-icon" aria-hidden>
              🕒
            </span>
            <span className="date-header__action-label">History</span>
            {historyCount > 0 && (
              <span className="date-header__action-count" aria-hidden>
                {historyCount > 99 ? "99+" : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <h1 className="date-header__title">What's for dinner?</h1>
      <div className="date-header__date">
        <span className="date-header__weekday">{weekday}</span>
        <span className="date-header__dot" aria-hidden>
          •
        </span>
        <span className="date-header__ymd">{dateStr}</span>
      </div>
    </header>
  );
}
