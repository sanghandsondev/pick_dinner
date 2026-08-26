interface DateHeaderProps {
  date: Date;
}

const WEEKDAYS = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function DateHeader({ date }: DateHeaderProps) {
  const weekday = WEEKDAYS[date.getDay()];
  const dateStr = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

  return (
    <header className="date-header">
      <div className="date-header__eyebrow">Bữa tối hôm nay</div>
      <h1 className="date-header__title">Tối nay ăn gì?</h1>
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
