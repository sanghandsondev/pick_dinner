interface DateHeaderProps {
  date: Date;
  historyCount: number;
  onOpenHistory: () => void;
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
}: DateHeaderProps) {
  const weekday = WEEKDAYS[date.getDay()];
  const dateStr = `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  return (
    <header className="date-header">
      <div className="date-header__top">
        <div className="date-header__eyebrow">Tonight's dinner</div>
        <button
          type="button"
          className="date-header__history"
          onClick={onOpenHistory}
          aria-label={`Open history (${historyCount} entries)`}
        >
          <span className="date-header__history-icon" aria-hidden>
            🕒
          </span>
          <span className="date-header__history-label">History</span>
          {historyCount > 0 && (
            <span className="date-header__history-count" aria-hidden>
              {historyCount > 99 ? "99+" : historyCount}
            </span>
          )}
        </button>
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
