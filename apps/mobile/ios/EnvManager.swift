import Foundation
import UIKit
import React

@objc(EnvManager)
class EnvManager: NSObject {

  private let defaults = UserDefaults.standard

  @objc
  func getEnv(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    resolve(defaults.string(forKey: "DEV_ENV") ?? "staging")
  }

  @objc
  func switchEnv(_ env: String) {
#if DEBUG
    defaults.set(env, forKey: "DEV_ENV")
#endif
  }

@objc
func restartApp() {
  DispatchQueue.main.async {
    guard
      let appDelegate = UIApplication.shared.delegate as? AppDelegate,
      let window = appDelegate.window,
      let factory = appDelegate.reactNativeFactory
    else {
      return
    }

    // Clear existing root controller
    window.rootViewController = nil

    // Restart React Native cleanly
    factory.startReactNative(
      withModuleName: "SplitBuddy",
      in: window,
      launchOptions: nil
    )
  }
}

  @objc
  func getBuildInfo(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let info = Bundle.main.infoDictionary ?? [:]
    let isRelease: Bool
      #if DEBUG
        isRelease = false
      #else
        isRelease = true
      #endif
    resolve([
      "version": info["CFBundleShortVersionString"] as? String ?? "0",
      "buildNumber": info["CFBundleVersion"] as? String ?? "0",
      "platform": "ios",
      "isRelease": isRelease
    ])
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }
}