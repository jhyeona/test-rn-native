// current : 현재 버전
// minVersion : 최소 버전
export const isVersionLower = ({
  current,
  minVersion,
}: {
  current: string;
  minVersion: string;
}): boolean => {
  const currentParts = current.split('.').map(Number);
  const minParts = minVersion.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, minParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const minPart = minParts[i] || 0;

    if (currentPart > minPart) return false; // 현재 버전이 최소 버전보다 크면 false
    if (currentPart < minPart) return true; // 현재 버전이 최소 버전보다 작으면 true
  }

  return false; // 두 버전이 같은 경우
};
