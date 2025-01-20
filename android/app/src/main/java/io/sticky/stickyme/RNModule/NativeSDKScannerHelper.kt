package io.sticky.stickyme.RNModule

import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.pm.PackageManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import io.sticky.android.sdk.stickySDK
import io.sticky.android.sdk.modules.scanner.domain.entity.BeaconEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.CellEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.LocationEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.WifiEntity

import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class NativeSDKScannerHelper(private val sdk: stickySDK) {

    fun generateBeaconKey(beacon: BeaconEntity): String {
        return "${beacon.identifier}_${beacon.major}_${beacon.minor}"
    }

    fun generateWifiKey(wifi: WifiEntity): String {
        return "${wifi.ssid}_${wifi.bssid}"
    }

    // 비콘 데이터 정제
    fun convertToWritableBeaconArray(beacons: List<BeaconEntity>): WritableArray {
        // 중복 제거를 위한 맵. key: "identifier_major_minor"
        val uniqueBeaconMap = mutableMapOf<String, BeaconEntity>()

        for (beacon in beacons) {
            val key = "${beacon.identifier}_${beacon.major}_${beacon.minor}"
            uniqueBeaconMap[key] = beacon
        }

        val beaconArray = Arguments.createArray()
        for ((bssid, rssi, ssid, major, minor, createdAt, battery, identifier) in uniqueBeaconMap.values) {
            val beaconMap = Arguments.createMap()
            beaconMap.putString("bssid", bssid)
            beaconMap.putInt("rssi", rssi)
            beaconMap.putString("ssid", ssid)
            beaconMap.putInt("major", major)
            beaconMap.putInt("minor", minor)
            beaconMap.putDouble("createdAt", createdAt.toDouble())
            beaconMap.putInt("battery", battery)
            beaconMap.putString("identifier", identifier)
            beaconArray.pushMap(beaconMap)
        }
        return beaconArray
    }

    // 와이파이 데이터 정제
    fun convertToWritableWifiArray(wifis: List<WifiEntity>): WritableArray {
        val wifiArray = Arguments.createArray()
        for (wifi in wifis) {
            val wifiMap = Arguments.createMap()
            wifiMap.putString("ssid", wifi.ssid)
            wifiMap.putString("bssid", wifi.bssid)
            wifiMap.putInt("rssi", wifi.rssi)
            wifiMap.putInt("bandwidth", wifi.bandwidth)
            wifiMap.putInt("frequency", wifi.frequency)

            wifiArray.pushMap(wifiMap)
        }
        return wifiArray
    }

    // 셀 데이터 정제
    fun convertToWritableCellArray(cells: List<CellEntity>): WritableArray {
        val cellArray = Arguments.createArray()
        for (cell in cells) {
            val cellMap = Arguments.createMap()

            cellMap.putBoolean("isRegistered", cell.isRegistered)
            cellMap.putString("eNB", cell.eNB)
            cellMap.putString("cellId", cell.cellId)
            cellMap.putString("mcc", cell.mcc)
            cellMap.putString("mnc", cell.mnc)
            cellMap.putInt("tac", cell.tac)
            cellMap.putInt("pci", cell.pci)
            cellMap.putString("networkType", cell.networkType)
            cellMap.putInt("rsrp", cell.rsrp)
            cellMap.putInt("rsrq", cell.rsrq)
            cellMap.putString("telecom", cell.telecom)
            cellMap.putString("phoneNumber", cell.phoneNumber)
            cellMap.putBoolean("isUSim", cell.isUSim)

            cellArray.pushMap(cellMap)
        }
        return cellArray
    }

    // 위치 데이터
    suspend fun getLocationSuspend(): LocationEntity = suspendCoroutine { continuation ->
        sdk.getLocation { locationEntity ->
            continuation.resume(locationEntity)
        }
    }

    // 블루투스 지원 및 사용 여부
    fun getBluetoothStatus(context: ReactApplicationContext): Pair<Boolean, Boolean> {
        val hasBluetoothFeature =
            context.packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH)
        val hasBluetoothLeFeature =
            context.packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)

        // isFeature: BLE 및 Bluetooth 지원 여부
        val isFeature = hasBluetoothFeature && hasBluetoothLeFeature

        if (!isFeature) {
            // 블루투스가 지원되지 않으면 isEnabled는 false로 설정
            return Pair(false, false)
        }

        // BluetoothManager 및 BluetoothAdapter 초기화
        val bluetoothManager =
            context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
        val bluetoothAdapter = bluetoothManager?.adapter

        // Bluetooth 활성화 상태
        val isBluetoothEnabled = bluetoothAdapter?.isEnabled ?: false

        return Pair(isFeature, isBluetoothEnabled)
    }
}
