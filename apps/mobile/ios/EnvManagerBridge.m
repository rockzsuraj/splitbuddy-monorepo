#import <React/RCTBridgeModule.h>

// This exposes the Swift class `EnvManager` to React Native
@interface RCT_EXTERN_MODULE(EnvManager, NSObject)

RCT_EXTERN_METHOD(getEnv:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(switchEnv:(NSString *)env)

RCT_EXTERN_METHOD(restartApp)

RCT_EXTERN_METHOD(getBuildInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end