//
//  stickySdkParseHelper.h
//  stickyme
//
//  Created by zoey on 1/13/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface stickySdkParseHelper : NSObject

- (NSDictionary *)parseBeacon:(NSDictionary *)beaconString;
- (NSDictionary *)parseWifi:(NSString *)wifiString;
- (NSDictionary *)parseLocation:(NSString *)locationString;

@end

NS_ASSUME_NONNULL_END
