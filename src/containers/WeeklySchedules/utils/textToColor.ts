// 사용할 색상 목록
import {COLORS} from '#constants/colors.ts';

const colors = [
  {text: COLORS.dark.gray, bg: COLORS.light.gray},
  {text: COLORS.dark.blue, bg: COLORS.light.blue},
  {text: COLORS.dark.red, bg: COLORS.light.red},
  {text: COLORS.dark.green, bg: COLORS.light.green},
  {text: COLORS.dark.orange, bg: COLORS.light.orange},
];

// 해시 값을 계산하는 함수
const generateHash = (text: string): number => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash); // 해시 계산
  }
  return Math.abs(hash); // 음수일 수 있으므로 절대값으로 변환
};

// 입력된 텍스트에 따라 항상 같은 색상을 선택하는 함수
export const getRandomColor = (text: string): {text: string; bg: string} => {
  const hash = generateHash(text); // 텍스트로 해시 값 생성
  const index = hash % colors.length; // 해시 값을 색상 배열 크기로 나눈 나머지로 인덱스 계산

  return colors[index];
};
