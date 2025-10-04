
//백엔드에서 오는 원본 데이터 타입
export type BackendNotice = {
  id: number;
  title: string;
  category:
    | 'ADMINISTRATION'
    | 'MEDICAL'
    | 'HOUSING'
    | 'EMPLOYMENT'
    | 'EDUCATION'
    | 'LIFE_SUPPORT';
  organization: string | null;
  sourceUrl: string | null;
  applyStartAt: string | null;
  applyEndAt: string | null;
  eligibility: string | null;
  tags: 'BENEFIT' | 'SYSTEM' | 'PROGRAM' | null;
  isPeriodLimited: boolean;
  visa?: string | null;         
  nationality?: string | null;  //비자 국적 추가
};