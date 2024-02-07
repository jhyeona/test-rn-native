//
//  BeaconModule.m
//  imhereV2
//
//  Created by rudy.lee on 11/13/23.
//
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface RCT_EXTERN_MODULE(BeaconModule, RCTEventEmitter)


RCT_EXTERN_METHOD(requestToBluetoothEnable:
                  (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startScanning:
                  (NSArray<NSString *> *)uuidStrings
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopScanning:
                  (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getScanResultsForDuration:
                  (double)duration
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
