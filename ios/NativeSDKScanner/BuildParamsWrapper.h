//
//  BuildParamsWrapper.h
//  stickyme
//
//  Created by zoey on 1/8/25.
//

#ifndef BuildParamsWrapper_h
#define BuildParamsWrapper_h

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface BuildParamsWrapper : NSObject

@property (nonatomic, copy, readonly, nullable) NSArray<NSString *> *beaconUUID;
@property (nonatomic, assign, readonly) BOOL isWifiEnable;
@property (nonatomic, assign, readonly) BOOL isLocationEnable;
@property (nonatomic, assign, readonly) BOOL isBeaconEnable;
@property (nonatomic, assign, readonly) NSInteger beaconTTL;

- (instancetype)initWithBeaconUUID:(NSArray<NSString *> *)beaconUUID
                     isWifiEnable:(BOOL)isWifiEnable
                 isLocationEnable:(BOOL)isLocationEnable
                   isBeaconEnable:(BOOL)isBeaconEnable
                        beaconTTL:(NSInteger)beaconTTL;

@end

NS_ASSUME_NONNULL_END


#endif /* BuildParamsWrapper_h */
