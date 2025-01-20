package io.sticky.stickyme.RNModule

import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.nativesdkscanner.NativeSDKScannerSpec
import io.sticky.android.sdk.stickySDK
import io.sticky.android.sdk.modules.scanner.data.model.BeaconFilter
import io.sticky.android.sdk.modules.scanner.domain.entity.BeaconEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.CellEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.WifiEntity
import io.sticky.stickyme.RNModule.NotificationUtil.createNotificationChannel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel

class NativeSDKScannerModule(reactContext: ReactApplicationContext) : NativeSDKScannerSpec(reactContext) {

    private val sharedPref = reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val helper = NativeSDKScannerHelper(stickySDK())
    private val bluetoothHelper = BluetoothHelper(reactApplicationContext, sdk, sharedPref)
    private val fgHelper = ForegroundServiceHelper(reactApplicationContext)

    companion object {
        private const val PREFS_NAME = "stickyme_prefs"
        const val NAME = "NativeSDKScanner"
        val sdk = stickySDK()
        val coroutineScope = CoroutineScope(Dispatchers.IO + Job())
        var reactContext: ReactApplicationContext? = null
        lateinit var serviceIntent: Intent
    }

    init {
        bluetoothHelper.startBluetoothStateMonitoring()
        createNotificationChannel(reactApplicationContext)

        Companion.reactContext = reactContext
    }

    /* Example for Encrypt SharedPreferences */
//     val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
//     val sharedPref = EncryptedSharedPreferences.create(
//         "secure_prefs",
//         masterKeyAlias,
//         context,
//         EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
//         EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
//     )

    override fun getName() = NAME

    private fun checkSDKInitialized(promise: Promise): Boolean {
        if (!sdk.scannerIsInitialized()) {
            promise.reject("SDK_NOT_INITIALIZED", "SDK is not initialized.")
            return false
        }
        return true
    }

    override fun bluetoothFeatureEnabled(promise: Promise) {
        try {
            val (isFeature, isEnabled) = helper.getBluetoothStatus(reactApplicationContext)
            val result = Arguments.createMap()
            result.putBoolean("isFeature", isFeature)
            result.putBoolean("isEnabled", isEnabled)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("BLUETOOTH_ERROR", "Failed to check Bluetooth feature and status", e)
        }
    }

    override fun scannerInitialize(params: ReadableMap) {
        val beaconFilterArray = params.getArray("beaconFilter")
        val isWifiEnable = params.getBoolean("isWifiEnable")
        val isCellEnable = params.getBoolean("isCellEnable")
        val isLocationEnable = params.getBoolean("isLocationEnable")
        val isBeaconEnable = params.getBoolean("isBeaconEnable")
        val beaconTTL = if (params.hasKey("beaconTTL")) params.getInt("beaconTTL") else 600_000

        val editor = sharedPref.edit()
        editor.putBoolean("isWifiEnable", isWifiEnable)
        editor.putBoolean("isCellEnable", isCellEnable) // 자동이탈체크 ON 일 경우 사용
        editor.putBoolean("isLocationEnable", isLocationEnable)
        editor.putBoolean("isBeaconEnable", isBeaconEnable)
        editor.putInt("beaconTTL", beaconTTL)
        editor.apply()

        val (isFeature, isEnabled) = helper.getBluetoothStatus(reactApplicationContext)
        if (!isFeature || !isEnabled) return

        val beaconFilterList = mutableListOf<String>()

        beaconFilterArray?.let { array ->
            for (i in 0 until array.size()) {
                array.getString(i).let { beaconFilterList.add(it) }
            }
        }

        val beaconFilter = BeaconFilter(
            deviceName = null,
            uuid = beaconFilterList.toTypedArray()
        )
        Log.d(":: beaconFilter", "$beaconFilter")
        sdk.scannerInitialize(
            context = reactApplicationContext,
            beaconFilter = beaconFilter,
            isWifiEnable = isWifiEnable,
            isCellEnable = isCellEnable,
            isLocationEnable = isLocationEnable,
            isBeaconEnable = isBeaconEnable,
            beaconTTL = beaconTTL
        )
    }

    override fun scannerIsInitialized(): Boolean {
        return sdk.scannerIsInitialized()
    }

    override fun scannerDestroy() {
        Log.d(":: SDK DESTROY", "SUCCESS")
        val editor = sharedPref.edit()
        editor.clear()
        editor.apply()
        fgHelper.stopForegroundService(serviceIntent)
        coroutineScope.cancel()
        sdk.scannerDestroy()
    }

    override fun beaconScannerIsRunning(): Boolean? {
        return sdk.beaconScannerIsRunning()
    }

    override fun getLocation(promise: Promise) {
        if (!checkSDKInitialized(promise)) return
        sdk.getLocation { locationEntity ->
            val locationMap: WritableMap = Arguments.createMap()
            locationMap.putString("lat", locationEntity.lat)
            locationMap.putString("lon", locationEntity.lon)
            locationMap.putString("alt", locationEntity.alt)
            locationEntity.accuracy?.let {
                locationMap.putDouble("accuracy", it.toDouble())
            }
            promise.resolve(locationMap)
        }
    }

    override fun getBeacons(promise: Promise) {
        if (!checkSDKInitialized(promise)) return
        val beacons: List<BeaconEntity>? = sdk.getBeacons()
        if (beacons != null) {
            val convertBeacons = helper.convertToWritableBeaconArray(beacons)
            promise.resolve(convertBeacons)
        } else {
            promise.resolve(Arguments.createArray()) // 빈 배열
        }
    }

    override fun getWifis(promise: Promise) {
        if (!checkSDKInitialized(promise)) return

        val wifis: List<WifiEntity>? = sdk.getWifis()
        if (wifis != null) {
            val convertWifis = helper.convertToWritableWifiArray(wifis)
            promise.resolve(convertWifis)
        } else {
            promise.resolve(Arguments.createArray())
        }
    }

    override fun getCells(promise: Promise) {
        if (!checkSDKInitialized(promise)) return

        val cells: List<CellEntity>? = sdk.getCell()
        if (cells != null) {
            val convertCells = helper.convertToWritableCellArray(cells)
            promise.resolve(convertCells)
        } else {
            promise.resolve(Arguments.createArray()) // 빈 배열
        }
    }

    override fun startEscapeCheck(apiItems: ReadableMap, promise: Promise) {
        serviceIntent = Intent(reactApplicationContext, ForegroundService::class.java).apply {
            putExtra("apiItems", apiItems.toHashMap())
        }
        fgHelper.startForegroundService(serviceIntent)
    }


    override fun invalidate() {
        bluetoothHelper.stopBluetoothStateMonitoring()
        scannerDestroy()
    }
}