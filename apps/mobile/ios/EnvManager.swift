@objc(EnvManager)
class EnvManager: NSObject {

  let defaults = UserDefaults.standard

  @objc
  func getEnv(_ resolve: RCTPromiseResolveBlock,
              rejecter reject: RCTPromiseRejectBlock) {
    let env = defaults.string(forKey: "DEV_ENV") ?? "dev"
    resolve(env)
  }

  @objc
  func setEnv(_ env: String,
              resolver resolve: RCTPromiseResolveBlock,
              rejecter reject: RCTPromiseRejectBlock) {

    #if DEBUG
      defaults.set(env, forKey: "DEV_ENV")
      resolve(nil)
    #else
      reject("FORBIDDEN", "Env switching disabled in prod", nil)
    #endif
  }

  @objc
  func clearAllStorage(_ resolve: RCTPromiseResolveBlock,
                       rejecter reject: RCTPromiseRejectBlock) {
    #if DEBUG
      defaults.removePersistentDomain(
        forName: Bundle.main.bundleIdentifier!
      )

      // Keychain wipe
      let secItemClasses = [
        kSecClassGenericPassword,
        kSecClassInternetPassword,
        kSecClassCertificate,
        kSecClassKey,
        kSecClassIdentity
      ]

      for secClass in secItemClasses {
        SecItemDelete([kSecClass: secClass] as CFDictionary)
      }

      resolve(nil)
    #endif
  }

  @objc
  func restartApp() {
    #if DEBUG
      DispatchQueue.main.async {
        RCTReloadCommandSetBundleURL(nil)
      }
    #endif
  }
  @objc
func getBuildInfo(_ resolve: RCTPromiseResolveBlock,
                  rejecter reject: RCTPromiseRejectBlock) {

  let info = Bundle.main.infoDictionary

  let version = info?["CFBundleShortVersionString"] as? String ?? "0"
  let build = info?["CFBundleVersion"] as? String ?? "0"

  resolve([
    "version": version,
    "buildNumber": build
  ])
}
}