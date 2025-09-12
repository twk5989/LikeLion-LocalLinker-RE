//2025-09-12 00:00:000 이거를 25.09.12 형태로 변경해줌
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  const yy = String(d.getFullYear() % 100).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}.${mm}.${dd}`;
}

//시작,종료일에 대한 데이터를 문자열로 가공
export function buildPeriod(start: string | null, end: string | null): string {
  if (!start && !end) return '상시';
  if (start && end) return `${fmtDate(start)}~${fmtDate(end)}`;
  if (start) return `${fmtDate(start)}~미정`;
  return `미정~${fmtDate(end!)}`;
}
