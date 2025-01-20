import {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import {UserInfoProps} from '#types/user.ts';

// 유저정보의 기관 정보를 중복제거하여 만든 기관 리스트
export const getUniqueAcademyList = (userData: UserInfoProps) => {
  if (userData.studentList.length === 0 && userData.teacherList.length === 0) {
    return []; // 데이터가 없을 경우 빈 배열 반환
  }
  const academyIds = new Set<string>(); // 중복 제거를 위한 Set
  const combinedList = [...userData.studentList, ...userData.teacherList];
  return combinedList.reduce((acc: Array<ItemProps>, val) => {
    const academyId = val.academy.academyId;
    if (!academyIds.has(academyId)) {
      academyIds.add(academyId);
      acc.push({
        label: val.academy.name,
        id: academyId,
      });
    }
    return acc;
  }, []);
};
