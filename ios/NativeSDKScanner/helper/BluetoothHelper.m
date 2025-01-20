//
//  BluetoothHelper.m
//  stickyme
//
//  Created by zoey on 1/7/25.
//

#import "BluetoothHelper.h"
#import <CoreBluetooth/CoreBluetooth.h>

@interface BluetoothHelper () <CBCentralManagerDelegate>
@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic, copy) RCTPromiseResolveBlock resolveBlock;
@property (nonatomic, copy) RCTPromiseRejectBlock rejectBlock;
@end

@implementation BluetoothHelper

+ (instancetype)sharedInstance {
  static BluetoothHelper *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[BluetoothHelper alloc] init];
  });
  return sharedInstance;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    self.centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
  }
  return self;
}

- (void)bluetoothFeatureEnabled:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  if (self.resolveBlock || self.rejectBlock) {
    NSLog(@"Promise is already in progress. Ignoring this call.");
    return;
  }
  self.resolveBlock = resolve;
  self.rejectBlock = reject;
  [self checkBluetoothState];
}

- (void)checkBluetoothState {
  BOOL isFeature = (self.centralManager != nil);
  BOOL isEnabled = NO;

  switch (self.centralManager.state) {
    case CBManagerStatePoweredOn:
      isEnabled = YES;
      break;
    case CBManagerStatePoweredOff:
    case CBManagerStateUnsupported:
    case CBManagerStateUnauthorized:
    case CBManagerStateResetting:
    case CBManagerStateUnknown:
    default:
      isEnabled = NO;
      break;
  }

  if (self.resolveBlock) {
    self.resolveBlock(@{
      @"isFeature": @(isFeature),
      @"isEnabled": @(isEnabled)
    });
    [self clearPromiseBlocks];
  }
}

- (void)clearPromiseBlocks {
  // 블록 초기화
  self.resolveBlock = nil;
  self.rejectBlock = nil;
}

#pragma mark - CBCentralManagerDelegate

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
  [self checkBluetoothState];
}

@end
