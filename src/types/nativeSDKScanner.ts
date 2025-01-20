/**
 *
 * */
export interface NativeBluetoothFeatureEnabled {
  isFeature: boolean;
  isEnabled: boolean;
}

/**
 * Scanner initialize
 *
 * @Property isWifiEnable 와이파이 수집 사용 여부
 * @Property isCellEnable 기지국 등 셀정보 수집 사용 여부
 * @Property isLocationEnable 위치 수집 사용 여부
 * @Property isBeaconEnable 비콘 수집 사용 여부
 * @Property beaconTTL 비콘 수집 주기 (seconds)
 * */
export interface NativeSDKScannerInit {
  beaconFilter?: string[];
  isWifiEnable?: boolean;
  isCellEnable?: boolean;
  isLocationEnable?: boolean;
  isBeaconEnable?: boolean;
  beaconTTL?: number;
}

/**
 * Location
 *
 * @property lat 위도
 * @property lon 경도
 * @property alt 고도
 * @property accuracy 정확도
 */
export interface NativeSDKLocationProps {
  lat: string;
  lon: string;
  alt: string;
  accuracy: number;
}

/**
 * Beacon
 *
 * @property ssid 기기 아이디
 * @property bssid 블루투스 하드웨어 주소
 * @property major 메이저(고유값)
 * @property minor 마이너(고유값)
 * @property rssi 신호 세기
 * @property createdAt 생성 시간
 * @property battery 비콘 배터리
 * @property identifier 비콘 UUID
 * @constructor Create empty Beacon data
 */
export interface NativeSDKBeaconProps {
  bssid?: string;
  rssi: number;
  ssid?: string;
  major: number;
  minor: number;
  createdAt?: number;
  battery?: number;
  identifier: string;
}

/**
 * Wifi
 *
 * @property ssid AP명
 * @property bssid Mac 주소
 * @property rssi 신호세기
 * @property bandwidth 대역폭
 * @property frequency 주파수
 * @constructor Create empty Wifi entity
 */
export interface NativeSDKWifiProps {
  ssid: string;
  bssid: string;
  rssi: number;
  bandwidth?: number;
  frequency?: number;
}

/**
 * 단말기 정보
 *
 * @property isRegistered 서빙 셀 여부(true: 서빙 셀, false: 인접 기지국)
 * @property eNB eNodeB, Evolved Node B. 기지국 정보.
 * @property cellId Cell Identify(20bit eNB + 8 bit Cell id)
 * @property mcc Mobile Country Code
 * @property mnc Mobile Network Code
 * @property tac 4G, 5G에서 사용 하는 위치 지역 코드(lac: 2G, 3G에서 사용 하는 위치 지역 코드)
 * @property pci Physical Cell Identifier. 물리적 셀 식별자.
 * @property networkType 3G, 4G, 5G Etc...
 * @property rsrp Reference Signal Received Power. 해당 셀에서 수신한 신호 강도(dBm).
 * @property rsrq Reference Signal Received Quality. 해당 셀의 신호품질.
 * @property telecom telecom("SKT", "LGU+", "KT" ...)
 * @property phoneNumber 전화번호
 * @property isUSim eSim/uSim 구분(true: eSim, false: uSim)
 */
export interface NativeSDKCellProps {
  isRegistered: boolean;
  eNB: string;
  cellId: string;
  mcc: string;
  mnc: string;
  tac: number;
  pci: number;
  networkType: string;
  rsrp: number;
  rsrq: number;
  telecom: string;
  phoneNumber: string;
  isUSim: boolean;
}

/**
 * 자동이탈체크 시작 (SDK 의 asyncPOST 사용)
 *
 * @Property token 로그인 토큰 (for header)
 * @Property stickyme_uuid 기기 UUID (for header)
 * @Property stickyme_os 기기 OS (for header)
 * @Property stickyme_version 앱 버전 (for header)
 * @Property stickyme_location_permit 위치 권한 허용 여부 (for header)
 * @Property scheduleId 자동이탈체크 스케쥴 아이디 (for body)
 * @Property intervalSeconds 반복할 주기 (seconds)
 * @Property endTime 종료시간 ()
 * */
export interface StartEscapeCheckProps {
  token?: string;
  stickyme_uuid?: string;
  stickyme_os?: string;
  stickyme_version?: string;
  stickyme_location_permit?: boolean;
  scheduleId: string;
  intervalSeconds?: number;
  endTime?: number;
}
