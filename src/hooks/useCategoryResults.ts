import * as React from 'react';
import api from '../apis';
import { mapBackendList } from '../mappers/notice';  //백엔드 응답을 프론트 형태(Notice)로 변환
import { normalizeCategory } from '../utils/category'; //카테고리 문자열 보정.(오타 및 대소문자)
import { qs } from '../utils/query';  //쿼리 스트링으로 직렬화
import type { BackendNotice, Notice } from '../types/notices';  //정의한 타입 임포트
import type { CategoryCode } from '../types/category'; //카테고리 코드 열거형 타입

type Params = { //훅이 받을 인자들의 타입을 정의
  cat: CategoryCode;
  page?: number;
  size?: number;
  visa?: string;
  married?: boolean;
};

const VISA_RE = /^(C|D|E|F|G|H)_[0-9]+$/; //비자 코드 형식(D_2)언더바

async function fetchCategory(base: any, signal: AbortSignal) {
  const url = `/api/postings/category?${qs(base)}`;
  const res = await api.get<BackendNotice[]>(url, { signal });
  return res.data;
}

export function useCategoryResults(params: Params) {
  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {           //params값이 바뀔때마다 실행되는 훅
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const visaParam =    //비자코드가 문자열, 정규식이면 사용. 아니면 undefined처리
          typeof params.visa === 'string' && VISA_RE.test(params.visa)
            ? params.visa
            : undefined;

        const base = {         //api요청용 객체를 구성(??- 값이 없으면 기본값)
          category: params.cat,
          page: params.page ?? 0,
          size: params.size ?? 50,
          visa: visaParam,
        };

        const got = await fetchCategory(base, ac.signal);  //api를 호출하여 got 배열을 받음.
        const strict = got.filter(  //category 보정(normalizeCategory) 후 params.cat과 정확히 일치하는 것만 필터링.
          (n) => normalizeCategory(n.category) === params.cat, 
        );
        const finalItems = strict.length > 0 ? strict : got;

        if (!ac.signal.aborted) {
          setList(mapBackendList(finalItems));
          setLoading(false);
        }
      } catch (e: any) {              //예외처리
        if (!ac.signal.aborted) {
          setError(e?.message ?? String(e));
          setList([]);
          setLoading(false);
        }
      }
    })();
    return () => ac.abort();
  }, [params.cat, params.page, params.size, params.visa]);

  return { list, loading, error };
}
