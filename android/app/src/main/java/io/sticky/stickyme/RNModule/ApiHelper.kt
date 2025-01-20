package io.sticky.stickyme.RNModule

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.BatteryManager
import android.os.Build
import android.telephony.SubscriptionInfo
import android.telephony.SubscriptionManager
import android.util.Log
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import io.sticky.android.sdk.stickySDK
import io.sticky.android.sdk.modules.scanner.domain.entity.BeaconEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.WifiEntity
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import okhttp3.Headers
import java.util.Locale

class ApiHelper(
    private val context: ReactApplicationContext,
    private val helper: NativeSDKScannerHelper,
    private val sdk: stickySDK
) {

    // 전화/위치 권한 확인
    private fun checkLocationAndPhonePermissions(context: ReactApplicationContext): Pair<Boolean, Boolean> {
        val locationPermissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )

        val phonePermissions = mutableListOf(Manifest.permission.READ_PHONE_STATE)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            phonePermissions.add(Manifest.permission.READ_PHONE_NUMBERS)
        }

        val locationPermit = locationPermissions.all { permission ->
            ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED
        }

        val phonePermit = phonePermissions.all { permission ->
            ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED
        }

        return Pair(locationPermit, phonePermit)
    }

    fun getBatteryLevel(): Int {
        val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }

    fun createHeaders(apiItems: ReadableMap): Headers {
        val token = apiItems.getString("token")
        val (locationPermit, phonePermit) = checkLocationAndPhonePermissions(context)

        return Headers.Builder()
            .add("Authorization", "Bearer $token")
            .add("stickyme-uuid", apiItems.getString("stickyme_uuid") ?: "")
            .add("stickyme-version", apiItems.getString("stickyme_version") ?: "")
            .add("stickyme-os", apiItems.getString("stickyme_os") ?: "")
            .add("stickyme-location-permit", locationPermit.toString())
            .add("stickyme-phone-permit", phonePermit.toString())
            .add("stickyme-battery-level", getBatteryLevel().toString())
            .build()
    }

    private fun getCollectedData(
        sdk: stickySDK,
        beaconMap: MutableMap<String, BeaconEntity>,
        wifiMap: MutableMap<String, WifiEntity>,
    ): Triple<List<Wifi>, List<Ble>, List<CellInfo>> {

        val beacons = beaconMap.values.toList()
        val wifis = wifiMap.values.toList()

        val wifiList = wifis.map { wifiEntity ->
            Wifi(
                ssid = wifiEntity.ssid.replace("^\"|\"$".toRegex(), "").trim(),
                bssid = wifiEntity.bssid,
                rssi = wifiEntity.rssi
            )
        }

        val bleList = beacons.map { beaconEntity ->
            Ble(
                uuid = beaconEntity.identifier,
                rssi = beaconEntity.rssi,
                minor = beaconEntity.minor,
                major = beaconEntity.major,
            )
        }
        var cellList = emptyList<CellInfo>()
        val activeSubscriptions = getActiveSubscriptions(context)
        if (activeSubscriptions.isNullOrEmpty()) {
            Log.d(":: Subscription", "No active SIM cards found.")
//            notifyUserNoSim()
//            handleNoSimScenario(promise)
        } else {
            cellList = sdk.getCell()?.map { cellEntity ->
                CellInfo(
                    mcc = cellEntity.mcc,
                    mnc = cellEntity.mnc,
                    tac = cellEntity.tac.toString(),
                    ci = cellEntity.cellId,
                    pci = cellEntity.pci.toString(),
                    rssi = cellEntity.rsrp,
                )
            } ?: emptyList()

        }

        return Triple(wifiList, bleList, cellList)
    }

    // 시간을 yyyy-mm-ddTHH:mm:ss 로 포맷
    private fun getCurrentTimeKotlinx(): String {
        val currentMoment = Clock.System.now()

        val currentDateTime = currentMoment.toLocalDateTime(TimeZone.currentSystemDefault())

        val formattedTime = String.format(
            Locale.KOREA,
            "%04d-%02d-%02dT%02d:%02d:%02d",
            currentDateTime.year,
            currentDateTime.monthNumber,
            currentDateTime.dayOfMonth,
            currentDateTime.hour,
            currentDateTime.minute,
            currentDateTime.second
        )

        return formattedTime
    }

    suspend fun createRequestData(
            scheduleId: String,
            beaconMap: MutableMap<String, BeaconEntity>,
            wifiMap: MutableMap<String, WifiEntity>
        ): RequestEscapeCheck {
        val (wifiList, bleList, cellList) = getCollectedData(sdk, beaconMap = beaconMap, wifiMap = wifiMap)
        val time = getCurrentTimeKotlinx()
        val location = helper.getLocationSuspend()

        return RequestEscapeCheck(
            list = listOf(
                Schedule(
                    scheduleId = scheduleId,
                    latitude = location.lat.toFloatOrNull() ?: 0.0f,
                    longitude = location.lon.toFloatOrNull() ?: 0.0f,
                    altitude = location.alt.toFloatOrNull() ?: 0.0f,
                    wifis = wifiList,
                    bles = bleList,
                    cellInfos = cellList,
                    timeCheck = time,
                    errorMessage = ""
                )
            )
        )
    }



    private fun getActiveSubscriptions(context: ReactApplicationContext): List<SubscriptionInfo>? {
        val subscriptionManager = context.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as? SubscriptionManager
        return try {
            subscriptionManager?.activeSubscriptionInfoList
        } catch (e: SecurityException) {
            Log.e(":: Subscription", "Permission error: ${e.message}")
            null
        } catch (e: Exception) {
            Log.e(":: Subscription", "Error retrieving subscriptions: ${e.message}")
            null
        }
    }

}