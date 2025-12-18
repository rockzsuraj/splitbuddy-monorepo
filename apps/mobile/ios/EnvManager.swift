import Foundation
import React

@objc(EnvManager)
class EnvManager: NSObject {

  private let defaults = UserDefaults.standard

  @objc
  func getEnv(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    resolve(defaults.string(forKey: "DEV_ENV") ?? "dev")
  }

  @objc
  func switchEnv(_ env: String) {
#if DEBUG
    defaults.set(env, forKey: "DEV_ENV")
#endif
  }

  @objc
  func getBuildInfo(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let info = Bundle.main.infoDictionary ?? [:]
    resolve([
      "version": info["CFBundleShortVersionString"] as? String ?? "0",
      "buildNumber": info["CFBundleVersion"] as? String ?? "0",
      "platform": "ios"
    ])
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }
}