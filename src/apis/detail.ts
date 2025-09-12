import api from './index';

export interface PostingResponse {
  id: number;
  title: string;
  category:
    | 'ADMINISTRATION'
    | 'MEDICAL'
    | 'EDUCATION'
    | 'HOUSING'
    | 'EMPLOYMENT'
    | 'LIFE_SUPPORT';
  sourceUrl: string;
  applyStartAt: string | null;
  applyEndAt: string | null;
  eligibility: string;
  tags: string;
  isPeriodLimited: boolean;
  detail: string;
}

// 공고 상세 조회 API
export const getPostingDetail = async (
  postingId: number,
): Promise<PostingResponse | null> => {
  const onboardingInfo = JSON.parse(
    localStorage.getItem('onboardingInfo') || '{}',
  );

  try {
    const response = await api.get<PostingResponse>(
      `/api/postings/${postingId}`,
      { params: { language: onboardingInfo.nation } },
    );
    return response.data ?? null;
  } catch (error) {
    console.error('[getPostingDetail ERROR]', error);
    return null;
  }
};
