//
//  ApiHelper.h
//  stickyme
//
//  Created by zoey on 1/14/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ApiHelper : NSObject

+ (instancetype)sharedInstance;

/// @param urlString API URL
/// @param headers API Headers
/// @param body API Body JSON (NSDictionary)
/// @param completion API 완료 핸들러 (성공 시 JSON, 실패 시 NSError)
- (void)startRequestWithUrl:(NSString *)urlString
                    headers:(NSDictionary<NSString *, NSString *> *)headers
                       body:(NSDictionary *)body
                 completion:(void (^)(NSDictionary * _Nullable response, NSError * _Nullable error))completion;

@end

NS_ASSUME_NONNULL_END
