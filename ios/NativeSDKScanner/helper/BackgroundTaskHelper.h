//
//  BackgroundTaskHelper.h
//  stickyme
//
//  Created by zoey on 1/8/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface BackgroundTaskHelper : NSObject

+ (instancetype)sharedInstance;

- (void)showForegroundNotification:(NSString *)title
                           message:(NSString *)message;

- (void)startBackgroundTaskWithName:(NSString *)taskName
                            handler:(void (^)(void))taskHandler
                  expirationHandler:(void (^)(void))expirationHandler;

- (void)endBackgroundTask;


@end

NS_ASSUME_NONNULL_END
