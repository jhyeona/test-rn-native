import {useRecoilValue} from 'recoil';

import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';

// 현재 선택된 기관에 등록된 학생 정보
export const useGetAttendeeId = () => {
  const selectAcademyId = useRecoilValue(GlobalState.selectedAcademy);
  const {userData} = useGetUserInfo();

  const attendee = userData?.studentList.filter(val => {
    return val.academy.academyId === selectAcademyId;
  });
  return attendee?.[0]?.attendeeId ?? '';
};
