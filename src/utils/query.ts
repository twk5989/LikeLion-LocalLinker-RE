// 쿼리 파라미터 직렬화(useCategoryResults)
//o 객체를 받아서 URL 쿼리스트링(key=value&...)으로 변환
//최종적으로는 URLSearchParams.toString()으로 직렬화된 문자열 반환

export function qs(o: Record<string, any>) {
  const u = new URLSearchParams();
  Object.entries(o).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === 'string' && v.trim() === '') return;
    u.set(k, String(v));
  });
  return u.toString();
}

// 응답 배열 안전하게 꺼내기(useDue)
export function unpackArray(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.postings)) return res.postings;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.content)) return res.content;
  if (Array.isArray(res?.list)) return res.list;
  return [];
}
