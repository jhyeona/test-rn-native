import * as Sentry from '@sentry/react-native';

export const sentryCaptureException = ({
  error,
  payload,
  tags,
  level,
  eventName,
}: {
  error: any;
  // [eventName] 필수. 해당 값이 없으면 메일로 알림을 보냅니다.
  eventName: string;
  payload?: any;
  tags?: Record<string, any>;
  level?: Sentry.SeverityLevel;
}) => {
  console.log(`* ${eventName} error`, error);

  Sentry.withScope(scope => {
    scope.setTransactionName(`${eventName}`);
    payload && scope.setExtra('payload', payload); // Additional Data
    level && scope.setLevel(level);
    scope.setTags({
      eventName,
      ...tags,
    });
    scope.captureException(error);
  });
};
