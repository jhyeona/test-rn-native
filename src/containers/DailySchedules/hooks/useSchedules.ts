import {useCallback} from 'react';
import {Platform} from 'react-native';

import {useRecoilState, useRecoilValue} from 'recoil';

import {APP_VERSION, BEACON_UUID} from '#constants/common.ts';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import {LocationProps, WifiProps} from '#types/location.ts';
import {PostEventProps, ScheduleDefaultProps} from '#types/schedule.ts';
import {StudentInfoProps} from '#types/user.ts';
import {getDeviceUUID} from '#utils/common.ts';
import {
  getBeacons,
  getLocation,
  getWifis,
  initScanner,
  isInitScanner,
} from '#utils/stickySdkHelper.ts';

interface BeaconProps {
  rssi: number;
  major: string;
  minor: string;
  uuid: string;
}

// 현재 선택된 기관에 등록된 학생, 강사 정보
export const useGetAttendeeInfo = () => {
  const selectedAcademyId = useRecoilValue(GlobalState.selectedAcademy);
  const {userData} = useGetUserInfo();

  const filterByAcademy = (list?: StudentInfoProps[]) =>
    list?.filter(item => item.academy.academyId === selectedAcademyId) || [];

  const attendees = {
    students: filterByAcademy(userData?.studentList),
    teachers: filterByAcademy(userData?.teacherList),
  };

  const attendeesList = [...attendees.students, ...attendees.teachers];
  const beaconUuids = attendeesList.map(attendee => attendee.academy.uuids)?.flat();
  const useEscapeCheck =
    attendeesList.length > 0 && attendeesList.every(attendee => attendee.academy.useEscapeCheck);

  return {
    selectedAttendeeInfo: attendees,
    selectedAcademyUseEscapeCheck: useEscapeCheck,
    beaconFilter: beaconUuids?.length === 0 ? BEACON_UUID : beaconUuids,
  };
};

// 출석 시 필요한 payload 데이터
export const useEventPayload = ({
  scheduleData,
  selectedAcademyUseEscapeCheck,
}: {
  scheduleData?: ScheduleDefaultProps;
  selectedAcademyUseEscapeCheck?: boolean;
}) => {
  const [beaconState, setBeaconState] = useRecoilState(GlobalState.beaconState);
  const [wifiState, setWifiState] = useRecoilState(GlobalState.wifiState);

  return useCallback(
    async (scheduleId: string): Promise<PostEventProps> => {
      const isSDKInit = isInitScanner();
      if (!isSDKInit)
        initScanner({
          isCellEnable:
            selectedAcademyUseEscapeCheck && scheduleData?.lecture.lectureUseEscapeCheck, // 자동이탈 체크 여부에 따라 cell Enable 설정
        });

      // BEACON 처리
      const beaconListData: BeaconProps[] = (await getBeacons()) ?? [];

      // WIFI 처리
      const wifiListData: WifiProps[] = (await getWifis()) ?? [];

      // 위치 정보 처리
      let locationData: LocationProps | undefined = await getLocation();

      // Device ID 처리
      const deviceId = await getDeviceUUID();

      // 출석 체크 payload 생성
      return {
        scheduleId,
        deviceInfo: deviceId,
        os: `${Platform.OS} ${Platform.Version}`,
        appVersion: APP_VERSION,
        latitude: locationData?.latitude ?? 0.1,
        longitude: locationData?.longitude ?? 0.1,
        altitude: locationData?.altitude ?? 0.1,
        wifis: wifiListData,
        bles: beaconListData,
      };
    },
    [beaconState, setBeaconState, wifiState, setWifiState],
  );
};
