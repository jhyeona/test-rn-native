//
//  LocationModule.m
//  imhereV2
//
//  Created by ImDokyun on 2022/06/09.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LocationModule, NSObject)
RCT_EXTERN_METHOD(
                  getCell: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  getGpsLocation: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  getWifiList: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  getConnectedWifi: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
@end

