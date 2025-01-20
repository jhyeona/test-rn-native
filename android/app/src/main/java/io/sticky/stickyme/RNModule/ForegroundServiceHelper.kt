package io.sticky.stickyme.RNModule

import MTypeAdapter
import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.google.gson.GsonBuilder
import io.sticky.android.sdk.modules.scanner.domain.entity.BeaconEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.WifiEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

class ForegroundServiceHelper(
    private val context: ReactApplicationContext
) {
    // Foreground Service 시작
    fun startForegroundService(serviceIntent: Intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent)
        } else {
            context.startService(serviceIntent)
        }
    }

    // Foreground Service 중지
    fun stopForegroundService(serviceIntent: Intent) {
        context.stopService(serviceIntent)
        Log.d(":: FGS", "STOP")
    }


    // Foreground 에서 작업할 내용
    fun escapeCheck(apiItems: ReadableMap, promise: Promise, coroutineScope: CoroutineScope ) {
        val sdk = NativeSDKScannerModule.sdk
        val intervalRunner = IntervalRunner(context)
        val helper = NativeSDKScannerHelper(sdk)
        val apiHelper = ApiHelper(context, helper, sdk)
        val beaconMap = mutableMapOf<String, BeaconEntity>()
        val wifiMap = mutableMapOf<String, WifiEntity>()
        val collector = IntervalCollector(beaconMap, wifiMap, helper)
        val gson = GsonBuilder()
            .registerTypeAdapter(RequestEscapeCheck::class.java, MTypeAdapter())
            .create()

        collector.start(sdk, promise)

        val intervalSeconds = apiItems.getDouble("intervalSeconds").takeIf { it > 0 }
            ?: throw IllegalArgumentException("IntervalSeconds must be greater than 0")
        val endTime = apiItems.getDouble("endTime").takeIf { it > 0 }
            ?: throw IllegalArgumentException("EndTime must be greater than 0")

        Log.d(":: intervalSeconds", "$intervalSeconds")
        Log.d(":: endTime", "$endTime")

        try {
            intervalRunner.start(
                intervalSeconds,
                newEndTime = endTime,
                action = { count ->
                    coroutineScope.launch {
                        try {
                            val baseUrl = apiItems.getString("baseUrl")
                            val headers = apiHelper.createHeaders(apiItems)
                            val requestData = apiHelper.createRequestData(
                                scheduleId = apiItems.getString("scheduleId") ?: "No Schedule ID",
                                beaconMap = beaconMap,
                                wifiMap = wifiMap,
                            )

                            Log.d(":: [$count] REQ", gson.toJson(requestData))
                            sdk.asyncPOST(
                                url = "$baseUrl/escape-check/submit",
                                headers = headers,
                                requestData = gson.toJson(requestData),
                                responseType = ResponseEscapeCheck::class.java,
                            ) { _ ->
                                collector.dataClear()
                            }
                        } catch (e: Exception) {
                            Log.e(":: ERROR", e.toString())
                        }
                    }
                },
            )
            promise.resolve("Started Interval EscapeCheck")
        } catch (e: IllegalArgumentException) {
            Log.e("INVALID_ARGUMENT", e.message ?: "Invalid arguments")
            promise.reject("INVALID_ARGUMENT", e.message ?: "Invalid arguments provided.")
        } catch (e: Exception) {
            Log.e("UNKNOWN_ERROR", e.message ?: "Unknown error occurred")
            promise.reject("UNKNOWN_ERROR", e.message ?: "An unknown error occurred.")
        }
    }
}