import { CATEGORY_KO, TAG_KO } from '../constants/notices';
import { buildPeriod } from '../utils/date';
import type { BackendNotice, Notice } from '../types/notices';


//사실상 필요없음. 백엔드->프론트로 변환을 할 필요가 없음
//백엔드에서 온 BackendNotice를 프론트 전용 Notice로 변환.
export function mapBackendToNotice(dto: BackendNotice): Notice {
  return {
    id: String(dto.id),
    category: CATEGORY_KO[dto.category] || dto.category,
    type: dto.tags ? TAG_KO[dto.tags] : '',
    title: dto.title,
    dept: dto.eligibility || '',
    period: buildPeriod(dto.applyStartAt, dto.applyEndAt),
    isPeriodLimited: Boolean(dto.isPeriodLimited),
  };
}

// 백엔드의 BackendNotic e배열을 Notice 배열로 전환.
export function mapBackendList(list: BackendNotice[]): Notice[] {
  return list.map(mapBackendToNotice);
}
