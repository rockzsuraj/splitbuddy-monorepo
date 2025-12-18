package com.splitbuddy.envmanager

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.*
import com.splitbuddy.BuildConfig   // 👈 THIS FIXES IT

class EnvManagerModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private val prefs: SharedPreferences =
    reactContext.getSharedPreferences("env_manager", Context.MODE_PRIVATE)

  override fun getName(): String = "EnvManager"

  @ReactMethod
  fun getEnv(promise: Promise) {
    promise.resolve(prefs.getString("DEV_ENV", "dev"))
  }

  @ReactMethod
  fun switchEnv(env: String) {
    prefs.edit().putString("DEV_ENV", env).apply()
  }

  @ReactMethod
  fun getBuildInfo(promise: Promise) {
    val map = Arguments.createMap()
    map.putString("version", BuildConfig.VERSION_NAME)
    map.putString("buildNumber", BuildConfig.VERSION_CODE.toString())
    map.putString("platform", "android")
    promise.resolve(map)
  }
}