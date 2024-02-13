export interface BeaconProps {
  major: string;
  proximity: number;
  uuid: string;
  minor: string;
  accuracy: number;
  timestamp: number;
  rssi: number;
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
