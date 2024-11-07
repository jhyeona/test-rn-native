//
//  RCTNativeBaseInfo.m
//  ihereapp
//
//  Created by zoey on 11/5/24.
//

#import "RCTNativeBaseInfo.h"

static NSString *const RCTNativeLocalStorageKey = @"local-storage";

@interface RCTNativeBaseInfo()
@property (strong, nonatomic) NSUserDefaults *localStorage;
@end

@implementation RCTNativeBaseInfo

RCT_EXPORT_MODULE(NativeBaseInfo)

- (id) init {
  if (self = [super init]) {
    _localStorage = [[NSUserDefaults alloc] initWithSuiteName:RCTNativeLocalStorageKey];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params { 
  return std::make_shared<facebook::react::NativeBaseInfoSpecJSI>(params);
}

- (void)aMethod {
  NSLog(@"TEST A METHOD");
}

- (NSDictionary *)getTelephoneInfo {
    return @{
      @"mcc": [NSNull null],
      @"mnc": [NSNull null],
      @"lac": [NSNull null],
      @"cellId": [NSNull null],
      @"telecom": [NSNull null]
    };
}

- (NSString * _Nullable)getItem:(NSString *)key {
  return [self.localStorage stringForKey:key];
}

- (void)setItem:(NSString *)value key:(NSString *)key {
  [self.localStorage setObject:value forKey:key];
}

- (void)removeItem:(NSString *)key { 
  [self.localStorage removeObjectForKey:key];
}

- (void)clear {
  NSDictionary *keys = [self.localStorage dictionaryRepresentation];
  for (NSString *key in keys) {
    [self removeItem:key];
  }
}

@end
