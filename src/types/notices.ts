//프론트에서 사용하는 타입 
export type Notice = {
  id: string;
  category: string;
  type: string;
  title: string;
  dept: string;
  period: string;
  isNew?: boolean;
  isDueSoon?: boolean;
  isPeriodLimited?: boolean;
};

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
};