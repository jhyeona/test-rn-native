import {IS_ANDROID} from '#constants/common.ts';
import {
  requestCameraPermissions,
  requestLibraryPermissions,
  requestLocationPermissions,
  requestUseEscapeLocationPermissions,
  requestNotificationsPermission,
  requestPhonePermission,
} from '#permissions/index.ts';

export const PERMISSIONS_MODAL = {
  location: {
    request: requestLocationPermissions,
    message: `출결을 위해 ${IS_ANDROID ? '위치와 근처기기' : '위치'} 권한이 필요합니다. 확인을 누르시면 설정으로 이동합니다.`,
  },
  useEscapeLocation: {
    request: requestUseEscapeLocationPermissions,
    message: `해당 강의는 출결을 위해 ${IS_ANDROID ? '위치와 근처기기' : '[위치 항상 허용] 및 [정확한 위치]'} 권한이 필요합니다. 확인을 누르시면 설정으로 이동합니다.`,
  },
  phone: {
    request: requestPhonePermission,
    message: `해당 강의는 정확한 출결을 위해\n전화 권한이 필요합니다. 확인을 누르시면 설정으로 이동합니다.`,
  },
  library: {
    request: requestLibraryPermissions,
    message: `첨부를 위해 사진첩 접근 권한이 필요합니다. 확인을 누르시면 설정으로 이동합니다.`,
  },
  camera: {
    request: requestCameraPermissions,
    message: `첨부를 위해 카메라 사용 권한이 필요합니다. 확인을 누르시면 설정으로 이동합니다.`,
  },
  alert: {
    request: requestNotificationsPermission,
    message: `알림 설정을 위해 알림 권한이 필요합니다. 확인을 누르면 설정으로 이동합니다.`,
  },
  backgroundLecture: {
    request: null,
    message: `해당 강의는 강의 시간 동안 위치를 포함한 데이터를 수집하여 출석 상태를 정확하게 기록 및 확인합니다. 출석하시겠습니까?`,
  },
};
