//비자 전용 정규화 코드

export function normalizeVisa(val?: string): string | undefined {
  if (!val) return undefined;
  const s = val.replace(/\s+/g, '').replace('-', '_').toUpperCase();
  // C_4, D_2, E_7 … 형식만 허용
  return /^(C|D|E|F|G|H)_[0-9]+$/.test(s) ? s : undefined;
}