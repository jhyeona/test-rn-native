package io.sticky.stickyme.RNModule

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.Promise
import io.sticky.android.sdk.stickySDK
import io.sticky.android.sdk.modules.scanner.domain.entity.BeaconEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.WifiEntity

class IntervalCollector(
    private val beaconMap: MutableMap<String, BeaconEntity>,
    private val wifiMap: MutableMap<String, WifiEntity>,
    private val helper: NativeSDKScannerHelper
) {
    private var scanning = false
    private lateinit var handler: Handler
    private lateinit var runnable: Runnable

    fun start(sdk: stickySDK, promise: Promise) {
        Log.d(":: IntervalCollector", "START")
        if (scanning) {
            promise.reject("SCANNING_IN_PROGRESS", "Scanning is already in progress.")
            return
        }

        scanning = true
        handler = Handler(Looper.getMainLooper())
        runnable = object : Runnable {
            override fun run() {
                val beacons: List<BeaconEntity>? = sdk.getBeacons()
                Log.d(":: beacons", "$beacons")
                beacons?.forEach { beacon ->
                    val key = helper.generateBeaconKey(beacon)
                    beaconMap[key] = beacon
                }

                val wifis: List<WifiEntity>? = sdk.getWifis()
                wifis?.forEach { wifi ->
                    val key = helper.generateWifiKey(wifi)
                    wifiMap[key] = wifi
                }

                if (scanning) {
                    handler.postDelayed(this, 15000) // 수집 간격 15초
                }
            }
        }

        // 타이머 시작
        handler.post(runnable)
    }

    fun dataClear() {
        beaconMap.clear()
        wifiMap.clear()
    }

    fun stop() {
        if (!scanning) return
        scanning = false
        Log.d(":: SCANNING", "!? STOP ${scanning.toString()}")
        handler.removeCallbacks(runnable)
    }
}