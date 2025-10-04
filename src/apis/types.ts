export type Category =
  | 'ADMINISTRATION' | 'MEDICAL' | 'HOUSING'
  | 'EMPLOYMENT' | 'EDUCATION' | 'LIFE_SUPPORT';

export type Tag = 'BENEFIT' | 'SYSTEM' | 'PROGRAM';

export interface Posting {
  id: number;
  title: string;
  category: Category;
  organization: string;
  sourceUrl?: string;
  applyStartAt?: string;
  applyEndAt?: string;
  eligibility?: string;
  tags?: Tag | Tag[];
  isPeriodLimited: boolean;
  language?: string;
  visa?: string;
  nationality?: string;
  [k: string]: any;
}

export interface ChatRequest {
  query: string;
  language: string;
}

export interface ChatResponse {
  answer: string;
}
