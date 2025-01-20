declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: string;
    BASE_URL: string;
    BASE_URL_IP: string;
    S3_URL: string;
    ONESIGNAL_INIT_ID: string;
    CRYPT_KEY: string;
    SENTRY_KEY: string;
    SMS_PHONE: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
