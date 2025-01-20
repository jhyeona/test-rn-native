export interface BeaconDataProps {
  uuid: string;
  major: string;
  minor: string;
}
export interface BeaconProps extends BeaconDataProps {
  proximity: number;
  accuracy: number;
  timestamp: number;
  rssi: number;
  mac: string;
}

export interface WifiProps {
  ssid: string;
  bssid: string;
  rssi: number;
  timestamp?: number;
}

export interface LocationProps {
  altitude: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationOptionsProps {
  interval?: number;
  fastestInterval?: number;
  timeout?: number;
  maximumAge?: number;
  enableHighAccuracy?: boolean;
  waitForAccurateLocation?: boolean;
  distanceFilter?: number;
  useFused?: boolean;
}
