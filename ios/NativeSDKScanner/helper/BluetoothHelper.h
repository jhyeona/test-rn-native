//
//  BluetoothHelper.h
//  stickyme
//
//  Created by zoey on 1/7/25.
//

#ifndef BluetoothHelper_h
#define BluetoothHelper_h

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface BluetoothHelper : NSObject

+ (instancetype)sharedInstance;
- (void)bluetoothFeatureEnabled:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

@end

#endif /* BluetoothHelper_h */
