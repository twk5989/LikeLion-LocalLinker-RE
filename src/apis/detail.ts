import api from './index';

//백엔드에서 내려오는 공고 상세 데이터의 타입을 정의한 부분
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
): Promise<PostingResponse | null> => {   //반환 타입:위에 정의한 PostingResponse. 실패하면 null을 반환
  const onboardingInfo = JSON.parse(
    localStorage.getItem('onboardingInfo') || '{}', //localStorage에서 onboardingInfo키를 가져옴
  );

  try { //여기서부터 서버요청을 시작
    const response = await api.get<PostingResponse>( //GET요청을 보냄
      `/api/postings/${postingId}`, //요청 url방식
      { params: { language: onboardingInfo.nation } },
      //parms는 쿼리스트링. 즉 요청 url은 위의 방식이 아닌 /api/postings/123?language=KR 이런식으로 요청이 감
    );
    
    return response.data ?? null; //없으면 null 출력
  } catch (error) {
    console.error('[getPostingDetail ERROR]', error); //에러 발생시 출력되는 예외발생
    return null;
  }
};
