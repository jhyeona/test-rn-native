import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  getTelephoneInfo(): {
    mcc?: string;
    mnc?: string;
    cellId?: string;
    lac?: string;
    rssi?: string;
    nci?: string;
    pci?: string;
    eci?: string;
    telecom?: string;
  };

  setItem(value: string, key: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeBaseInfo');
