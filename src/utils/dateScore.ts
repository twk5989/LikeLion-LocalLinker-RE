//util-posting에 있던 정렬기준을 분리시킨 파일(기존에는 시작,종료일을 합쳐서 정렬기준을 정했음)

//문자열을 timestamp 변환
export function toTs(iso: string | null): number {
  return iso ? new Date(iso).getTime() : NaN;
}

//현재 시각 timestamp
export function nowTs(): number {
  return Date.now();
}

//최신공고 정렬 기준 (시작일 기준, 가까운 순)
export function latestScore(start: string | null): number {
  const t = toTs(start);
  return isNaN(t) ? Infinity : Math.abs(t - nowTs());
}

//마감임박 정렬 기준 (종료일 기준, 지나간 건 뒤로)
export function dueScore(end: string | null): number {
  const t = toTs(end);
  if (isNaN(t) || t < nowTs()) return Infinity; 
  return t - nowTs();
}
