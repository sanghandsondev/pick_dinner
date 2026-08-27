import { useEffect, useState } from "react";

/**
 * Trả về ngày "hôm nay" luôn tươi:
 * - Tick mỗi 60 giây để phát hiện sang ngày mới ngay cả khi user để app mở qua đêm.
 * - Re-sync khi tab trở lại foreground (visibilitychange) hoặc window focus,
 *   phòng khi PWA/tab bị OS suspend timer.
 * Chỉ setState khi ngày (Y/M/D) thực sự đổi để tránh render vô ích.
 */
export function useToday(): Date {
  const [today, setToday] = useState<Date>(() => new Date());

  useEffect(() => {
    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const check = () => {
      const now = new Date();
      setToday((prev) => (isSameDay(prev, now) ? prev : now));
    };

    const intervalId = window.setInterval(check, 60_000);

    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, []);

  return today;
}
