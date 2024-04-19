declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: string;
    BASE_URL: string;
    S3_URL: string;
    ONESIGNAL_INIT_ID: string;
    CRYPT_KEY: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
