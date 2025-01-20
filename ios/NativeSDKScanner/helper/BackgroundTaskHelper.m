//
//  BackgroundTaskHelper.m
//  stickyme
//
//  Created by zoey on 1/8/25.
//

#import "BackgroundTaskHelper.h"
#import <UserNotifications/UserNotifications.h>
#import <UIKit/UIKit.h>

@interface BackgroundTaskHelper ()
@property (nonatomic, assign) UIBackgroundTaskIdentifier backgroundTaskID;
@end

@implementation BackgroundTaskHelper


+ (instancetype)sharedInstance {
    static BackgroundTaskHelper *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[BackgroundTaskHelper alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _backgroundTaskID = UIBackgroundTaskInvalid;
    }
    return self;
}

- (void)showForegroundNotification:(NSString *)title message:(NSString *)message {
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound + UNAuthorizationOptionBadge)
                    completionHandler:^(BOOL granted, NSError * _Nullable error) {
      if (granted) {
          NSLog(@"Notification permission granted.");
      } else {
          NSLog(@"Notification permission denied: %@", error.localizedDescription);
      }
  }];

//  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];

  [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
          if (settings.authorizationStatus != UNAuthorizationStatusAuthorized &&
              settings.authorizationStatus != UNAuthorizationStatusProvisional) {
            NSLog(@"Notification permission not granted. No notification will be shown.");
            return;
          }
    
    // 알림 콘텐츠 설정
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = title;
    content.body = message;
    content.sound = [UNNotificationSound defaultSound];
    
    // 즉시 트리거
    UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:1 repeats:NO];
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"EscapeCheckNotification"
                                                                          content:content
                                                                          trigger:trigger];
    
    // 알림 추가
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
      if (error) {
        NSLog(@"Error scheduling notification: %@", error.localizedDescription);
      }
    }];
  }];
}


- (void)startBackgroundTaskWithName:(NSString *)taskName
                            handler:(void (^)(void))taskHandler
               expirationHandler:(void (^)(void))expirationHandler {
    // 기존 작업 종료
    [self endBackgroundTask];
    
    // 새 작업 시작
    self.backgroundTaskID = [[UIApplication sharedApplication] beginBackgroundTaskWithName:taskName
                                                                        expirationHandler:^{
        if (expirationHandler) {
            expirationHandler();
        }
        [self endBackgroundTask];
    }];
    
    // 작업 수행
    if (taskHandler) {
        taskHandler();
    }
}

- (void)endBackgroundTask {
    if (self.backgroundTaskID != UIBackgroundTaskInvalid) {
      UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
      [center removePendingNotificationRequestsWithIdentifiers:@[@"EscapeCheckNotification"]]; // 특정 알림만 제거

      [[UIApplication sharedApplication] endBackgroundTask:self.backgroundTaskID];
      self.backgroundTaskID = UIBackgroundTaskInvalid;
    }
}

@end
