package com.splitbuddy.envmanager

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.*
import com.splitbuddy.BuildConfig
import kotlin.system.exitProcess
import android.content.Intent
import android.os.Process

class EnvManagerModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private val prefs: SharedPreferences =
    reactContext.getSharedPreferences("env_manager", Context.MODE_PRIVATE)

  override fun getName(): String = "EnvManager"

  @ReactMethod
  fun getEnv(promise: Promise) {
    promise.resolve(prefs.getString("DEV_ENV", "staging"))
  }

  @ReactMethod
  fun switchEnv(env: String) {
    prefs.edit().putString("DEV_ENV", env).apply()
  }
@ReactMethod
fun restartApp() {
  val activity = currentActivity ?: return

  val intent = activity.packageManager
    .getLaunchIntentForPackage(activity.packageName)
    ?: return

  intent.addFlags(
    Intent.FLAG_ACTIVITY_NEW_TASK or
    Intent.FLAG_ACTIVITY_CLEAR_TASK
  )

  activity.startActivity(intent)

  // Finish all activities
  activity.finishAffinity()

  // Kill process AFTER activity launch
  android.os.Process.killProcess(android.os.Process.myPid())
}

  @ReactMethod
  fun getBuildInfo(promise: Promise) {
    val map = Arguments.createMap()
    map.putString("version", BuildConfig.VERSION_NAME)
    map.putString("buildNumber", BuildConfig.VERSION_CODE.toString())
    map.putString("platform", "android")
    map.putBoolean("isRelease", !BuildConfig.DEBUG)
    promise.resolve(map)
  }
}