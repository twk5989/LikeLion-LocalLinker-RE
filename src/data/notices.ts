//타입 + 매핑

//2025-09-12 00:00:000 이거를 25.09.12 형태로 변경해줌
function fmtDate(iso: string): string {
  const d = new Date(iso); // ISO가 로컬로 파싱
  const yy = String(d.getFullYear() % 100).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}.${mm}.${dd}`;
}

//시작,종료일에 대한 데이터를 문자열로 가공
function buildPeriod(start: string | null, end: string | null): string {
  if (!start && !end) return '상시';
  if (start && end) return `${fmtDate(start)}~${fmtDate(end)}`;
  if (start && !end) return `${fmtDate(start)}~미정`;
  return `미정~${fmtDate(end!)}`;
}

//여기가 가장 중요.
//백엔드에서 온 BackendNotice를 프론트 전용 Notice로 변환
export function mapBackendToNotice(dto: BackendNotice): Notice {
  const categoryKo = CATEGORY_KO[dto.category] ?? dto.category;
  const tagKo = dto.tags ? TAG_KO[dto.tags] : '';

  return {
    id: String(dto.id),
    category: categoryKo,
    type: tagKo,
    title: dto.title,
    dept: dto.eligibility ?? '',
    period: buildPeriod(dto.applyStartAt, dto.applyEndAt),
    isNew: false,
    isDueSoon: false,
    isPeriodLimited: !!dto.isPeriodLimited,
  };
}

// 백엔드의 BackendNotic e배열을 Notice 배열로 전환
export function mapBackendList(list: BackendNotice[]): Notice[] {
  return list.map(mapBackendToNotice);
}
