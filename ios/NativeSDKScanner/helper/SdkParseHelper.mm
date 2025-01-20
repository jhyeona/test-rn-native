//
//  stickySdkParseHelper.m
//  stickyme
//
//  Created by zoey on 1/13/25.
//
#import "stickySdkParseHelper.h"
#import <React/RCTLog.h>

@implementation stickySdkParseHelper


- (NSDictionary *)parseBeacon:(NSDictionary *)beaconData {
    if (beaconData[@"uuid"] && beaconData[@"rssi"] && beaconData[@"major"] && beaconData[@"minor"]) {
        return @{
            @"identifier": beaconData[@"uuid"],
            @"rssi": @([beaconData[@"rssi"] doubleValue]),
            @"major": @([beaconData[@"major"] integerValue]),
            @"minor": @([beaconData[@"minor"] integerValue])
        };
    } else {
        NSLog(@"Invalid beacon data: %@", beaconData);
        return nil;
    }
}


- (NSDictionary *)parseWifi:(NSString *)wifiString {
  NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"ssid: \\\"([^\"]+)\\\", bssid: \\\"([^\"]+)\\\", rssi: ([0-9\\.\\-]+)"
                                                                         options:0
                                                                           error:nil];
  NSTextCheckingResult *match = [regex firstMatchInString:wifiString
                                                  options:0
                                                    range:NSMakeRange(0, wifiString.length)];
  if (match) {
      NSString *ssid = [wifiString substringWithRange:[match rangeAtIndex:1]];
      NSString *bssid = [wifiString substringWithRange:[match rangeAtIndex:2]];
      NSString *rssi = [wifiString substringWithRange:[match rangeAtIndex:3]];

      return @{
          @"ssid": ssid,
          @"bssid": bssid,
          @"rssi": @([rssi doubleValue])
      };
  }

  // 파싱 실패 시
  return nil;
}


- (NSDictionary *)parseLocation:(NSString *)locationString {
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"lat: ([0-9\\.\\-]+), lon: ([0-9\\.\\-]+), alt: ([0-9\\.\\-]+), accuracy: ([0-9\\.\\-]+)"
                                                                           options:0
                                                                             error:nil];
    NSTextCheckingResult *match = [regex firstMatchInString:locationString
                                                    options:0
                                                      range:NSMakeRange(0, locationString.length)];
    if (match) {
        NSString *lat = [locationString substringWithRange:[match rangeAtIndex:1]];
        NSString *lon = [locationString substringWithRange:[match rangeAtIndex:2]];
        NSString *alt = [locationString substringWithRange:[match rangeAtIndex:3]];
        NSString *accuracy = [locationString substringWithRange:[match rangeAtIndex:4]];
        
        return @{
            @"lat": lat,
            @"lon": lon,
            @"alt": alt,
            @"accuracy": @([accuracy doubleValue])
        };
    }
    
    // 파싱 실패 시
    return @{};
}

@end
