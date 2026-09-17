/**
 * 전화번호 및 사업자등록번호 자동 하이픈(-) 포맷팅 유틸리티
 */

/**
 * 전화번호 자동 하이픈 포맷터 (한국 유선/휴대폰/대표번호 표준)
 * - 휴대폰 (010-XXXX-XXXX, 01X-XXX-XXXX)
 * - 서울 지역번호 (02-XXX-XXXX, 02-XXXX-XXXX)
 * - 지방 지역번호 및 인터넷전화 (031-XXX-XXXX, 031-XXXX-XXXX, 070-XXXX-XXXX)
 * - 전국 대표번호 (1588-XXXX, 1544-XXXX 등 8자리)
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length === 0) return '';

  // 1. 전국 대표번호 (1588, 1544, 1600 등 8자리)
  if (digits.length === 8 && !digits.startsWith('0')) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  // 2. 서울 지역번호 (02)
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  // 3. 일반 3자리 시작 번호 (010, 011, 031, 070, 0505 등)
  const cleanDigits = digits.slice(0, 11);
  if (cleanDigits.length <= 3) return cleanDigits;
  if (cleanDigits.length <= 6) return `${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3)}`;
  if (cleanDigits.length <= 10) return `${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 6)}-${cleanDigits.slice(6)}`;
  return `${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 7)}-${cleanDigits.slice(7, 11)}`;
};

/**
 * 사업자등록번호 자동 하이픈 포맷터 (10자리: XXX-XX-XXXXX)
 */
export const formatBusinessNumber = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/[^0-9]/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
};