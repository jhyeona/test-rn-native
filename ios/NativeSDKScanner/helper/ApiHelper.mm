//
//  ApiHelper.m
//  stickyme
//
//  Created by zoey on 1/14/25.
//
#import "ApiHelper.h"

@interface ApiHelper ()
@property (nonatomic, strong) NSURLSessionDataTask *currentTask;
@end

@implementation ApiHelper

+ (instancetype)sharedInstance {
    static ApiHelper *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[ApiHelper alloc] init];
    });
    return sharedInstance;
}

- (void)startRequestWithUrl:(NSString *)urlString
                    headers:(NSDictionary<NSString *, NSString *> *)headers
                       body:(NSDictionary *)body
                 completion:(void (^)(NSDictionary * _Nullable response, NSError * _Nullable error))completion {

    // 중복 요청 방지
    if (self.currentTask && self.currentTask.state == NSURLSessionTaskStateRunning) {
        NSLog(@"Request is already in progress. Ignoring...");
        if (completion) {
            NSError *error = [NSError errorWithDomain:@"ApiHelper"
                                                 code:409
                                             userInfo:@{NSLocalizedDescriptionKey: @"Request is already in progress."}];
            completion(nil, error);
        }
        return;
    }

    // URL 생성
    NSURL *url = [NSURL URLWithString:urlString];
    if (!url) {
        if (completion) {
            NSError *error = [NSError errorWithDomain:@"ApiHelper"
                                                 code:400
                                             userInfo:@{NSLocalizedDescriptionKey: @"Invalid URL."}];
            completion(nil, error);
        }
        return;
    }

    // 요청 생성
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];

    // 헤더 설정
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    for (NSString *key in headers) {
        [request setValue:headers[key] forHTTPHeaderField:key];
    }

    // JSON Body 설정
    NSError *jsonError;
    NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body options:0 error:&jsonError];
    if (jsonError) {
        if (completion) {
            completion(nil, jsonError);
        }
        return;
    }
    NSLog(@"Serialized JSON: %@", [[NSString alloc] initWithData:bodyData encoding:NSUTF8StringEncoding]);

    [request setHTTPBody:bodyData];

    // Task 생성
    NSURLSession *session = [NSURLSession sharedSession];
    self.currentTask = [session dataTaskWithRequest:request
                                  completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Request failed: %@", error.localizedDescription);
            if (completion) {
                completion(nil, error);
            }
        } else {
            NSError *jsonParseError;
            NSDictionary *responseObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonParseError];
            if (jsonParseError) {
                NSLog(@"JSON Parse Error: %@", jsonParseError.localizedDescription);
                if (completion) {
                    completion(nil, jsonParseError);
                }
            } else {
                NSLog(@"Response: %@", responseObject);
                if (completion) {
                    completion(responseObject, nil);
                }
            }
        }

        // Task 종료
        self.currentTask = nil;
    }];

    // Task 실행
    [self.currentTask resume];
}

@end
