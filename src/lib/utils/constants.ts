export const ORDER_STEPS = [
  { code: 'ORDER_RECEIVED', label: '주문 접수', emoji: '📦' },
  { code: 'AI_PROCESSING', label: '3D 모델링 중', emoji: '🤖' },
  { code: 'CONFIRM_WAITING', label: '시안 확인 대기', emoji: '👀' },
  { code: 'APPROVED', label: '시안 승인 완료', emoji: '✅' },
  { code: 'PRINTING_START', label: '출력 준비중', emoji: '🖨️' },
  { code: 'PRINTING_RESIN', label: '레진 출력 중', emoji: '🧪' },
  { code: 'PRINTING_PLA', label: 'PLA 출력 중', emoji: '🧵' },
  { code: 'POST_PROCESS', label: '후가공 중', emoji: '✨' },
  { code: 'PACKAGING', label: '포장 중', emoji: '📦' },
  { code: 'SHIPPED', label: '배송 시작', emoji: '🚚' },
  { code: 'DELIVERED', label: '배송 완료', emoji: '🎯' },
] as const

export type OrderStepCode = typeof ORDER_STEPS[number]['code']

export const OCCASIONS = [
  { code: 'ALL', label: '전체', accent: 'ink' },
  { code: 'MEMORIAL', label: '추모', accent: 'bronze' },
  { code: 'CELEBRATION', label: '축하·개업', accent: 'gold' },
  { code: 'COUPLE', label: '커플·웨딩', accent: 'rose' },
  { code: 'PET', label: '반려동물', accent: 'sage' },
] as const

export const CATEGORY_LABELS: Record<string, string> = {
  BUST: 'Bust',
  FULL_BODY: 'Full Body',
  CARICATURE: 'Caricature',
  COUPLE: 'Couple',
  PET: 'Pet',
  CUSTOM: 'Custom',
}

// Tailwind가 클래스명을 정적으로 스캔하기 때문에, 동적 조합(`text-${accent}`) 대신
// 이렇게 완성된 클래스 문자열을 미리 다 적어둬야 실제로 색이 적용됩니다.
export const ACCENT_CLASSES: Record<string, string> = {
  bronze: 'text-bronze border-bronze',
  gold: 'text-gold border-gold',
  rose: 'text-rose border-rose',
  sage: 'text-sage border-sage',
  ink: 'text-ink border-ink',
}

export const ACCENT_HEX: Record<string, string> = {
  bronze: '#8C6F4E',
  gold: '#B08C3E',
  rose: '#B37B72',
  sage: '#6E7A6A',
  ink: '#26231F',
}

export const STEPS = [
  { code: 'ORDER_RECEIVED', label: '주문 접수', emoji: '📦' },
  { code: 'AI_PROCESSING', label: '3D 모델링', emoji: '🤖' },
  { code: 'CONFIRM_WAITING', label: '시안 확인', emoji: '👀' },
  { code: 'APPROVED', label: '시안 승인', emoji: '✅' },
  { code: 'REVISION_REQUESTED', label: '수정 요청', emoji: '🔄' },
  { code: 'PRINTING_START', label: '출력 준비', emoji: '🖨️' },
  { code: 'PRINTING_RESIN', label: '레진 출력', emoji: '🧪' },
  { code: 'PRINTING_PLA', label: 'PLA 출력', emoji: '🧵' },
  { code: 'POST_PROCESS', label: '후가공', emoji: '✨' },
  { code: 'PACKAGING', label: '포장', emoji: '📦' },
  { code: 'SHIPPED', label: '배송중', emoji: '🚚' },
  { code: 'DELIVERED', label: '배송 완료', emoji: '🎯' },
] as const;