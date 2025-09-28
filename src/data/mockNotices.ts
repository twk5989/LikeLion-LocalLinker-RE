
import type { Notice } from '../types/notices';

// 행정 (10개)
const adminNotices: Notice[] = [
  { id: 'A1', category: '행정', type: '제도', title: '외국인 등록증 재발급 안내', dept: '출입국관리사무소', period: '25.09.01~25.12.31', isNew: true, isDueSoon: false, isPeriodLimited: true },
  { id: 'A2', category: '행정', type: '혜택', title: '체류 자격 변경 수수료 감면', dept: '법무부', period: '25.08.01~25.09.25', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'A3', category: '행정', type: '프로그램', title: '다문화 가정 행정 상담 지원', dept: '지자체', period: '25.07.01~25.10.30', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'A4', category: '행정', type: '제도', title: '외국인 민원 통역 서비스', dept: '행정안전부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'A5', category: '행정', type: '혜택', title: '외국인 전입신고 간소화 서비스', dept: '주민센터', period: '25.09.15~25.09.30', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'A6', category: '행정', type: '프로그램', title: '생활법률 상담 서비스', dept: '법률구조공단', period: '25.03.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'A7', category: '행정', type: '제도', title: '외국인 행정 서류 번역 지원', dept: '법무부', period: '25.04.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'A8', category: '행정', type: '혜택', title: '체류 자격 연장 안내 서비스', dept: '출입국관리사무소', period: '25.05.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'A9', category: '행정', type: '프로그램', title: '외국인 민원 편의 지원', dept: '행정안전부', period: '25.09.10~25.09.20', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'A10', category: '행정', type: '제도', title: '전자 민원 접수 시스템', dept: '지자체', period: '25.02.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
];

// 의료 (10개)
const medicalNotices: Notice[] = [
  { id: 'M1', category: '의료', type: '혜택', title: '외국인 무료 건강검진', dept: '보건소', period: '25.07.01~25.10.01', isNew: true, isDueSoon: false, isPeriodLimited: true },
  { id: 'M2', category: '의료', type: '혜택', title: '예방접종 지원', dept: '질병관리청', period: '25.06.01~25.09.20', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'M3', category: '의료', type: '제도', title: '응급 진료비 지원 제도', dept: '보건복지부', period: '25.05.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'M4', category: '의료', type: '프로그램', title: '다문화 가정 건강 교육', dept: '보건소', period: '25.03.01~25.09.30', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'M5', category: '의료', type: '혜택', title: '치과 진료 지원', dept: '보건복지부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'M6', category: '의료', type: '제도', title: '출산 의료비 지원 제도', dept: '보건복지부', period: '25.04.01~25.09.15', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'M7', category: '의료', type: '프로그램', title: '정신 건강 상담 프로그램', dept: '보건소', period: '25.06.01~25.12.01', isNew: true, isDueSoon: false, isPeriodLimited: true },
  { id: 'M8', category: '의료', type: '혜택', title: '의료 통역 서비스', dept: '지자체', period: '25.02.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'M9', category: '의료', type: '프로그램', title: '정기 건강 캠프', dept: '병원협회', period: '25.08.01~25.09.30', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'M10', category: '의료', type: '제도', title: '저소득 외국인 의료비 지원', dept: '보건복지부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
];

// 주거 (10개)
const housingNotices: Notice[] = [
  { id: 'H1', category: '주거', type: '제도', title: '외국인 임대주택 신청', dept: 'LH공사', period: '25.05.01~25.12.31', isNew: true, isDueSoon: false, isPeriodLimited: true },
  { id: 'H2', category: '주거', type: '혜택', title: '전세자금 대출 지원', dept: '국토교통부', period: '25.01.01~25.09.30', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'H3', category: '주거', type: '프로그램', title: '다문화가정 주거 상담', dept: '지자체', period: '25.02.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'H4', category: '주거', type: '제도', title: '외국인 주거 안정 보조금', dept: '지자체', period: '25.06.01~25.09.20', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'H5', category: '주거', type: '혜택', title: '신혼부부 임대주택 우선 공급', dept: 'LH공사', period: '25.09.01~25.12.31', isNew: true, isDueSoon: false, isPeriodLimited: true },
  { id: 'H6', category: '주거', type: '제도', title: '외국인 주택 보증금 지원', dept: '국토교통부', period: '25.07.01~25.10.15', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'H7', category: '주거', type: '프로그램', title: '주거 환경 개선 프로젝트', dept: '지자체', period: '25.04.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'H8', category: '주거', type: '혜택', title: '외국인 임대료 감면', dept: 'LH공사', period: '25.03.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'H9', category: '주거', type: '제도', title: '주택 보조금 신청', dept: '국토교통부', period: '25.08.01~25.09.25', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'H10', category: '주거', type: '프로그램', title: '외국인 주거 안정 지원센터 운영', dept: '지자체', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
];


// 취업/근로 (10개)
const employmentNotices: Notice[] = [
  { id: 'E1', category: '취업/근로', type: '프로그램', title: '외국인 취업 역량 강화 교육', dept: '고용노동부', period: '25.09.01~25.09.30', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'E2', category: '취업/근로', type: '혜택', title: '근로자 체류 연장 지원', dept: '법무부', period: '25.05.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'E3', category: '취업/근로', type: '제도', title: '외국인 근로자 고용 허가 제도', dept: '고용노동부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'E4', category: '취업/근로', type: '프로그램', title: '직업 훈련 지원 프로그램', dept: '지자체', period: '25.07.01~25.09.30', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'E5', category: '취업/근로', type: '혜택', title: '외국인 고용 기업 세제 혜택', dept: '기획재정부', period: '25.02.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'E6', category: '취업/근로', type: '제도', title: '외국인 근로자 임금 보장 제도', dept: '고용노동부', period: '25.04.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'E7', category: '취업/근로', type: '프로그램', title: '다문화 근로자 직무 교육', dept: '지자체', period: '25.03.01~25.09.15', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'E8', category: '취업/근로', type: '혜택', title: '외국인 근로자 숙소 지원', dept: '고용노동부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'E9', category: '취업/근로', type: '제도', title: '산재 보험 지원 제도', dept: '근로복지공단', period: '25.06.01~25.09.20', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'E10', category: '취업/근로', type: '프로그램', title: '취업 박람회 개최', dept: '고용노동부', period: '25.09.10~25.09.25', isNew: true, isDueSoon: true, isPeriodLimited: true },
];

// 교육 (10개)
const educationNotices: Notice[] = [
  { id: 'ED1', category: '교육', type: '혜택', title: '다문화가정 자녀 한국어 교육 지원', dept: '교육부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'ED2', category: '교육', type: '프로그램', title: '외국인 대학생 멘토링 프로그램', dept: '교육부', period: '25.08.01~25.09.30', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'ED3', category: '교육', type: '제도', title: '외국인 유학생 장학금 제도', dept: '교육부', period: '25.05.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'ED4', category: '교육', type: '혜택', title: '국립도서관 외국인 무료 이용', dept: '국립중앙도서관', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'ED5', category: '교육', type: '프로그램', title: '다문화 가정 방과후 교실', dept: '지자체', period: '25.07.01~25.09.15', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'ED6', category: '교육', type: '제도', title: '외국인 교원 연구 지원 제도', dept: '교육부', period: '25.03.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'ED7', category: '교육', type: '혜택', title: '외국인 학부모 교육 상담', dept: '교육청', period: '25.06.01~25.09.20', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'ED8', category: '교육', type: '프로그램', title: '한국어 집중 교육 과정', dept: '교육부', period: '25.09.01~25.09.25', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'ED9', category: '교육', type: '제도', title: '외국인 교환학생 제도', dept: '교육부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'ED10', category: '교육', type: '혜택', title: '다문화 학생 학습 멘토링', dept: '지자체', period: '25.04.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
];

// 생활 지원 (10개)
const lifeNotices: Notice[] = [
  { id: 'L1', category: '생활 지원', type: '혜택', title: '외국인 생활안정 지원금', dept: '지자체', period: '25.09.10~25.09.25', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'L2', category: '생활 지원', type: '프로그램', title: '외국인 문화 체험 행사', dept: '지자체', period: '25.08.01~25.09.20', isNew: false, isDueSoon: true, isPeriodLimited: true },
  { id: 'L3', category: '생활 지원', type: '제도', title: '외국인 생활 상담 서비스', dept: '보건복지부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'L4', category: '생활 지원', type: '혜택', title: '대중교통 요금 할인', dept: '지자체', period: '25.03.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'L5', category: '생활 지원', type: '프로그램', title: '외국인 가정 요리 교실', dept: '지자체', period: '25.05.01~25.09.30', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'L6', category: '생활 지원', type: '제도', title: '외국인 긴급 생활 지원 제도', dept: '보건복지부', period: '25.06.01~25.12.31', isNew: true, isDueSoon: false, isPeriodLimited: true },
  { id: 'L7', category: '생활 지원', type: '혜택', title: '다문화 가정 문화 바우처', dept: '문화체육관광부', period: '25.02.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'L8', category: '생활 지원', type: '프로그램', title: '외국인 생활체육 대회', dept: '지자체', period: '25.07.01~25.09.25', isNew: true, isDueSoon: true, isPeriodLimited: true },
  { id: 'L9', category: '생활 지원', type: '제도', title: '외국인 상담 전화 24시 운영', dept: '보건복지부', period: '25.01.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
  { id: 'L10', category: '생활 지원', type: '혜택', title: '외국인 자녀 양육비 지원', dept: '지자체', period: '25.04.01~25.12.31', isNew: false, isDueSoon: false, isPeriodLimited: true },
];

// 전체 합치기 (60개)
export const mockNotices: Notice[] = [
  ...adminNotices,
  ...medicalNotices,
  ...housingNotices,
  ...employmentNotices,
  ...educationNotices,
  ...lifeNotices,
];

// 최신 6개
export const mockLatestNotices = mockNotices.slice(0, 6).map((n, i) => ({
  ...n,
  id: `LATEST-${i + 1}`,
  isNew: true,
}));

// 마감 임박 5개
export const mockDueSoonNotices = mockNotices
  .filter((n) => n.isDueSoon)
  .slice(0, 5)
  .map((n, i) => ({
    ...n,
    id: `DUE-${i + 1}`,
  }));
