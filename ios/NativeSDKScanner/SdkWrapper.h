//
//  stickySdkWrapper.h
//  stickyme
//
//  Created by zoey on 1/7/25.
//

#ifndef stickySdkWrapper_h
#define stickySdkWrapper_h

#import <Foundation/Foundation.h>

@class BuildParamsWrapper;

NS_ASSUME_NONNULL_BEGIN

@interface SdkWrapper : NSObject

+ (instancetype)sharedInstance;

- (void)initialize:(BuildParamsWrapper *)params;
- (void)deinitialize;
- (bool)isInitialized;
- (nullable NSArray *)getBeaconList;
- (nullable NSString *)getLocation;
- (nullable NSString *)getWifi;

@end

NS_ASSUME_NONNULL_END

#endif /* stickySdkWrapper_h */
