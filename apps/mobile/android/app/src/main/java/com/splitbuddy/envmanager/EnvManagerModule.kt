package com.splitbuddy.envmanager

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.util.Log
import com.facebook.react.bridge.*

class EnvManagerModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  // ⚠️ DO NOT CLEAR THIS PREF
 private val envPrefs =
  reactContext.getSharedPreferences(
    "APP_ENV_PERSISTENT_V2",
    Context.MODE_PRIVATE
  )

  override fun getName() = "EnvManager"

  private fun isDebug(): Boolean {
    return reactContext.applicationInfo.flags and
      ApplicationInfo.FLAG_DEBUGGABLE != 0
  }

  // READ current env
  @ReactMethod
fun getEnv(promise: Promise) {
  val env = envPrefs.getString("env", "dev")
  android.util.Log.d(
    "EnvManager",
    "READ ENV FROM PREF FILE => $env"
  )
  promise.resolve(env)
}

  // SINGLE ENTRY POINT (JS MUST CALL ONLY THIS)
@ReactMethod
fun switchEnv(env: String, promise: Promise) {
  if (!isDebug()) {
    promise.reject("FORBIDDEN", "Env switch not allowed")
    return
  }

  android.util.Log.d("EnvManager", "Switching env to $env")

  // ✅ MUST be commit(), NOT apply()
  val success = envPrefs
    .edit()
    .putString("env", env)
    .commit()

  android.util.Log.d(
    "EnvManager",
    "ENV WRITE COMMIT RESULT => $success"
  )

  // Clear AsyncStorage
  reactContext.deleteDatabase("RKStorage")

  restartAppInternal()

  promise.resolve(null)
}

  // Build info for badge / modal
  @ReactMethod
  fun getBuildInfo(promise: Promise) {
    val pInfo = reactContext.packageManager
      .getPackageInfo(reactContext.packageName, 0)

    val map = Arguments.createMap()
    map.putString("version", pInfo.versionName)
    map.putString("buildNumber", pInfo.longVersionCode.toString())

    promise.resolve(map)
  }

  private fun restartAppInternal() {
  val context = reactContext.applicationContext
  val intent = context.packageManager
    .getLaunchIntentForPackage(context.packageName)
    ?: return

  intent.addFlags(
    Intent.FLAG_ACTIVITY_NEW_TASK or
    Intent.FLAG_ACTIVITY_CLEAR_TASK
  )

  context.startActivity(intent)

  // 🔥 kill AFTER commit
  android.os.Process.killProcess(android.os.Process.myPid())
}
}