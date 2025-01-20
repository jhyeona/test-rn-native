//
//  RCTNativeSDKScanner.mm
//  stickyme
//
//  Created by zoey on 12/12/24.
//

#import "RCTNativeSDKScanner.h"
#import "stickyme-Swift.h"
#import "ApiHelper.h"
#import "BluetoothHelper.h"
#import "stickySdkParseHelper.h"
#import "BackgroundTaskHelper.h"


static NSString *const RCTNativeLocalStorageKey = @"local-storage";

@interface RCTNativeSDKScanner()
@property (nonatomic, strong) SdkWrapper *sdk;
@property (nonatomic, assign) BOOL isEscapeCheckRunning; // 실행 상태 플래그

@end

@implementation RCTNativeSDKScanner

RCT_EXPORT_MODULE(RCTNativeSDKScanner)

- (id) init {
  if (self = [super init]) {
    _sdk = [SdkWrapper shared];
    _isEscapeCheckRunning = NO;
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSDKScannerSpecJSI>(params);
}

/// [SDK] 초기화
- (void)scannerInitialize:(JS::NativeSDKScanner::SpecScannerInitializeParams &)params {
  NSNumber *beaconTTL = params.beaconTTL().has_value() ? @(params.beaconTTL().value()) : nil;
  BOOL isBeaconEnable = params.isBeaconEnable();
  BOOL isWifiEnable = params.isWifiEnable();
  BOOL isLocationEnable = params.isLocationEnable();
  NSArray<NSString *> *beaconFilter = nil;
  if (params.beaconFilter().size() > 0) {
    NSMutableArray<NSString *> *convertedArray = [NSMutableArray arrayWithCapacity:params.beaconFilter().size()];
    for (size_t i = 0; i < params.beaconFilter().size(); i++) {
      NSString *item = params.beaconFilter()[i];
      [convertedArray addObject:item];
    }
    beaconFilter = [convertedArray copy];
  } else {
    beaconFilter = @[]; // 빈 배열 처리
  }

  BuildParamsWrapper *buildParams =
    [[BuildParamsWrapper alloc] initWithBeaconUUID:beaconFilter
                                  isLocationEnable:isLocationEnable
                                    isBeaconEnable:isBeaconEnable
                                      isWifiEnable:isWifiEnable
                                         beaconTTL:beaconTTL != nil ? beaconTTL.integerValue : 0];
  
  [self.sdk initializeWithParams:buildParams];
}

/// [SDK] 실행 여부
- (NSNumber *)scannerIsInitialized {
  return @([self.sdk isInitialized]);
}

/// [SDK] 종료
- (void)scannerDestroy {
  [self.sdk deinitialize];
  NSLog(@"SCANNER DESTROY");
}

/// [SDK] 비콘 데이터
- (void)getBeacons:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  NSArray *beaconList = [self.sdk getBeaconList];
  NSLog(@"beaconList: %@", beaconList);

  if (beaconList == nil || beaconList.count == 0) {
    NSLog(@"Beacon list is empty or nil");
    resolve(@[]);
    return;
  }
  
  stickySdkParseHelper *parser = [[stickySdkParseHelper alloc] init];

  NSMutableArray *parsedBeacons = [NSMutableArray array];
  for (NSDictionary *beaconDict in beaconList) {
    NSDictionary *parsedBeacon = [parser parseBeacon:beaconDict];
    if (parsedBeacon) {
        [parsedBeacons addObject:parsedBeacon];
    } else {
        NSLog(@"Failed to parse beacon: %@", beaconDict);
    }
  }

  resolve(parsedBeacons);
}




/// [SDK] 와이파이 데이터
- (void)getWifis:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  NSString *wifi = [self.sdk getWifi];
  NSLog(@"wifi %@", wifi);

  if (wifi == nil || [wifi length] == 0) {
    resolve(@[]);
    return;
  }

  // 파싱 + 배열
  stickySdkParseHelper *parser = [[stickySdkParseHelper alloc] init];
  NSDictionary *wifiDict = [parser parseWifi:wifi];
  NSMutableArray *parsedWifiList = [NSMutableArray array];

  if (wifiDict) {
    [parsedWifiList addObject:wifiDict];
  }

  resolve(parsedWifiList);
}


/// [SDK] 위치 데이터
- (void)getLocation:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  NSString *location = [self.sdk getLocation];
  NSLog(@"location %@", location);
  
  stickySdkParseHelper *parser = [[stickySdkParseHelper alloc] init];
  NSDictionary *locationDict = [parser parseLocation:location];
  NSLog(@"locationDict %@", locationDict);
  NSLog(@"locationDict count %lu", static_cast<unsigned long>(locationDict.count));

  if (locationDict.count > 0) {
      resolve(locationDict);
  } else {
      NSError *error = [NSError errorWithDomain:@"LocationErrorDomain"
                                           code:100
                                       userInfo:@{NSLocalizedDescriptionKey: @"Failed to parse location"}];
      reject(@"PARSE_ERROR", @"Failed to parse location", error);
  }
}

/// [SDK] 블루투스 기능 여부 및 권한 확인
- (void)bluetoothFeatureEnabled:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [[BluetoothHelper sharedInstance] bluetoothFeatureEnabled:resolve reject:reject];
}






/// [SDK] 자동이탈체크
- (void)startEscapeCheck:(JS::NativeSDKScanner::SpecStartEscapeCheckApiItems &)apiItems
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
  // 중복 실행 방지
  if (self.isEscapeCheckRunning) {
    NSLog(@"startEscapeCheck is already running. Ignoring this call.");
    return;
  }

  // 실행 상태 플래그 설정
  self.isEscapeCheckRunning = YES;

  // 작업 이름 정의
  NSString *taskName = @"EscapeCheckTask";

  // 종료 시간과 간격 설정
  NSTimeInterval intervalSeconds = apiItems.intervalSeconds();
  NSDate *endTime = [NSDate dateWithTimeIntervalSince1970:apiItems.endTime()];

  // 현재 시간 가져오기
  NSDate *currentDate = [NSDate date];

  // 종료 시간이 이미 지났는지 확인
  if ([currentDate compare:endTime] != NSOrderedAscending) {
      reject(@"E_INVALID_END_TIME", @"End time is in the past", nil);
      return;
  }

  // 요청 데이터 준비
  NSString *urlString = [NSString stringWithFormat:@"%@/escape-check/submit", apiItems.baseUrl()];
  NSString *scheduleId = apiItems.scheduleId();
  NSMutableDictionary<NSString *, NSString *> *headers = [NSMutableDictionary dictionary];

  // Bearer Token 설정
  NSString *token = apiItems.token();
  if (token) {
      headers[@"Authorization"] = [NSString stringWithFormat:@"Bearer %@", token];
  }
  
  // 배터리 정보
  UIDevice.currentDevice.batteryMonitoringEnabled = YES;
  float batteryLevel = UIDevice.currentDevice.batteryLevel * 100;
  NSString *batteryLevelString = batteryLevel >= 0 ? [NSString stringWithFormat:@"%.0f", batteryLevel] : @"unknown";


  // Custom Header 설정
  NSDictionary<NSString *, id> *customHeaderMapping = @{
      @"stickyme-uuid": apiItems.stickyme_uuid(),
      @"stickyme-version": apiItems.stickyme_version(),
      @"stickyme-os": apiItems.stickyme_os(),
      @"stickyme-location-permit": @(apiItems.stickyme_location_permit()).stringValue,
      @"stickyme-phone-permit": @(apiItems.stickyme_phone_permit()).stringValue,
      @"stickyme-battery-level": batteryLevelString
  };

  [headers addEntriesFromDictionary:customHeaderMapping];

  [[BackgroundTaskHelper sharedInstance] showForegroundNotification:@"여기여기붙어라 실행중"
                                                            message:@"실행중인 앱을 완전히 종료하지 마세요."];


  // * 데이터 누적 작업 시작
  [[SdkWrapper shared] startDataAccumulation];
  
  // * 데이터 누적을 위한 10초 대기
  [NSThread sleepForTimeInterval:10.0];
  
  // 백그라운드 작업 시작
  [[BackgroundTaskHelper sharedInstance] startBackgroundTaskWithName:taskName
                                                             handler:^{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      while ([[NSDate date] compare:endTime] == NSOrderedAscending) {
        
        // * 누적된 데이터
        NSDictionary *accumulatedData = [[SdkWrapper shared] getAccumulatedData];

        // 현재 시간 ISO 8601 형식으로 변환
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        formatter.dateFormat = @"yyyy-MM-dd'T'HH:mm:ss";
        NSString *timeCheck = [formatter stringFromDate:[NSDate date]];

        NSDictionary *location = [[SdkWrapper shared] getLocationOrigin];

        // Body 생성
        NSDictionary *body = @{
            @"list": @[
                @{
                    @"scheduleId": scheduleId,
                    @"latitude": location[@"latitude"],
                    @"longitude": location[@"longitude"],
                    @"altitude": location[@"altitude"],
                    @"wifis": accumulatedData[@"wifis"],
                    @"bles": accumulatedData[@"bles"],
                    @"cellInfos": @[],
                    @"timeCheck": timeCheck,
                    @"errorMessage": @""
                }
            ]
        };
        
        // ApiHelper 호출
        [self sendRequestWithUrl:urlString
                         headers:headers
                            body:body
                      completion:^(NSDictionary * _Nullable response, NSError * _Nullable error) {
          if (error) {
            NSLog(@"API 호출 실패: %@", error.localizedDescription);
          } else {
            NSLog(@"API 호출 성공: %@", response);
          }
        }];
        
        // 데이터 초기화
        [[SdkWrapper shared] resetAccumulatedData];
        
        // 반복 간격 대기
        [NSThread sleepForTimeInterval:intervalSeconds];
      }
      
      // 백그라운드 작업 종료 시 데이터 누적 중지
      [[SdkWrapper shared] stopDataAccumulation];
      
      // 작업 완료
      self.isEscapeCheckRunning = NO;
      [[BackgroundTaskHelper sharedInstance] endBackgroundTask];
      resolve(@{ @"status": @"completed" });
    });
  } expirationHandler:^{
    // 작업 만료 처리
    self.isEscapeCheckRunning = NO;
    [[BackgroundTaskHelper sharedInstance] endBackgroundTask];
    reject(@"E_BACKGROUND_TASK_EXPIRED", @"Background task expired", nil);
  }];
}

- (void)sendRequestWithUrl:(NSString *)urlString
                       headers:(NSDictionary<NSString *, NSString *> *)headers
                          body:(NSDictionary *)body
                    completion:(void (^)(NSDictionary * _Nullable response, NSError * _Nullable error))completion {

    // 요청 실행
    [[ApiHelper sharedInstance] startRequestWithUrl:urlString
                                            headers:headers
                                               body:body
                                         completion:^(NSDictionary * _Nullable response, NSError * _Nullable error) {
      if (completion) {
        completion(response, error);
      }
    }];
}


// =============== ( 미사용 ) ============= //
/// [SDK] (사용 X) 비콘 스캔 실행 여부
- (NSNumber *)beaconScannerIsRunning {
  return @NO;
}

/// [SDK] (사용 X) 셀 데이터
- (void)getCells:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  // iOS 는 cell 수집 불가
  NSArray *cells = @[];
  resolve(cells);
}


@end
