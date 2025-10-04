// src/data/mockNotices.ts
import type { BackendNotice } from '../types/notices';

/**
 * 카테고리 × 비자별로 3~4개씩 생성
 * - 카테고리: 6종 (백엔드 타입과 동일)
 * - 비자: 14종 (하이픈 형식: 'D-2', 'E-7' 등)  ← 필터는 mockOrApi에서 D_2로 입력해도 매칭됨
 * - 일부는 마감일/시작일 null로 섞어서 정렬/폴백 동작 확인 가능
 */

const CATEGORIES = [
  'ADMINISTRATION',
  'MEDICAL',
  'HOUSING',
  'EMPLOYMENT',
  'EDUCATION',
  'LIFE_SUPPORT',
] as const;

const VISAS = [
  'D-2', 'D-4', 'D-10',
  'E-1', 'E-2', 'E-7', 'E-9',
  'F-2', 'F-4', 'F-5', 'F-6',
  'H-2',
  'C-3', 'G-1',
] as const;

const NATIONALITIES = [
  'CN','JP','US','VN','TH','PH','ID','NP','UZ','RU','SG','IN','PK','BD','KH','MM','LA','MN',
] as const;

const ORGS = [
  '여성가족부','법무부','보건복지부','고용노동부','교육부','행정안전부',
  '서울특별시','경기도','부산광역시','인천광역시','대구광역시','대전광역시',
];

const TAGS: Array<BackendNotice['tags']> = ['BENEFIT', 'SYSTEM', 'PROGRAM', null];

/** YYYY-MM-DDTHH:mm:ss 형식 간단 생성 */
const iso = (y: number, m: number, d: number, h = 9) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00`;

/** 의사 랜덤(안정적 재현을 위해 시드 없이 인덱스 기반 결정) */
const pick = <T,>(arr: readonly T[], seed: number) => arr[seed % arr.length];

const makeTitle = (cat: string, visa: string, idx: number) =>
  `${cat} | ${visa} 대상 지원/제도 #${idx}`;

let idSeq = 1;

// 비자별 개수: 3 또는 4(번갈아가며)
const perVisaCount = (vIdx: number) => (vIdx % 2 === 0 ? 3 : 4);

function buildOne(
  cat: typeof CATEGORIES[number],
  visa: typeof VISAS[number],
  vIdx: number,
  k: number,                // 0..N-1
): BackendNotice {
  const i = idSeq++;
  const year = 2025 + ((vIdx + k) % 3); // 2025~2027
  const startMonth = ((vIdx + k) % 12) + 1; // 1~12
  const startDay = ((vIdx * 7 + k * 3) % 27) + 1; // 1~28
  const hasStart = (vIdx + k) % 6 !== 0; // 일부는 시작일 없음
  const hasEnd = (vIdx + k) % 4 !== 0;   // 일부는 마감일 없음

  const applyStartAt = hasStart ? iso(year, startMonth, startDay, 9) : null;

  // 마감은 시작 이후 30~180일 범위
  const spanDays = 30 + ((vIdx * 13 + k * 17) % 151); // 30~180
  const endDate = new Date(`${applyStartAt ?? iso(year, startMonth, startDay, 9)}`);
  endDate.setDate(endDate.getDate() + spanDays);
  const applyEndAt = hasEnd ? iso(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    18,
  ) : null;

  const organization = pick(ORGS, vIdx + k);
  const nationality = pick(NATIONALITIES, vIdx + k * 5);
  const tag = pick(TAGS, vIdx + k * 11);
  const isPeriodLimited = Boolean((vIdx + k) % 3 === 0);

  return {
    id: i,
    title: makeTitle(cat, visa, k + 1),
    category: cat,
    organization,
    sourceUrl: `https://example.com/post/${i}`,
    applyStartAt,
    applyEndAt,
    eligibility: (k + vIdx) % 2 === 0 ? '체류 외국인' : '결혼이민자 및 가족',
    tags: tag,
    isPeriodLimited,
    visa,                // 하이픈 형식 저장 (필터는 D_2도 매칭됨)
    nationality,         // 샘플 국적
  };
}

const mockNotices: BackendNotice[] = [];

CATEGORIES.forEach((cat, cIdx) => {
  VISAS.forEach((visa, vIdx) => {
    const n = perVisaCount(vIdx);
    for (let k = 0; k < n; k += 1) {
      mockNotices.push(buildOne(cat, visa, vIdx + cIdx, k));
    }
  });
});

export { mockNotices };
export default mockNotices;
