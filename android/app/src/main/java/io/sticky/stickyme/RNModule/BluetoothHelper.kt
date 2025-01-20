package io.sticky.stickyme.RNModule

import android.bluetooth.BluetoothAdapter
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import io.sticky.android.sdk.stickySDK

class BluetoothHelper(
    val reactApplicationContext: ReactApplicationContext,
    val sdk: stickySDK,
    private val sharedPref: SharedPreferences
) {
    private var bluetoothStateReceiver: BroadcastReceiver? = null

    private fun onBluetoothEnabled() {
//        if (!sdk.scannerIsInitialized()) {
//            val isWifiEnable = sharedPref.getBoolean("isWifiEnable", false)
//            val isCellEnable = sharedPref.getBoolean("isCellEnable", false)
//            val isLocationEnable = sharedPref.getBoolean("isLocationEnable", false)
//            val isBeaconEnable = sharedPref.getBoolean("isBeaconEnable", false)
//            val beaconTTL = sharedPref.getInt("beaconTTL", 30000)
//
//            sdk.scannerInitialize(
//                context = reactApplicationContext,
//                beaconFilter = null,
//                isWifiEnable = isWifiEnable,
//                isCellEnable = isCellEnable,
//                isLocationEnable = isLocationEnable,
//                isBeaconEnable = isBeaconEnable,
//                beaconTTL = beaconTTL
//            )
//        }
    }

    private fun onBluetoothDisabled() {
        sdk.scannerDestroy()
    }

    fun startBluetoothStateMonitoring() {
        // BroadcastReceiver 초기화
        bluetoothStateReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent?.action == BluetoothAdapter.ACTION_STATE_CHANGED) {
                    val state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR)
                    handleBluetoothStateChange(state)
                }
            }
        }

        // BroadcastReceiver 등록
        val intentFilter = IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED)
        reactApplicationContext.registerReceiver(bluetoothStateReceiver, intentFilter)
    }

    fun stopBluetoothStateMonitoring() {
        // BroadcastReceiver 해제
        bluetoothStateReceiver?.let {
            reactApplicationContext.unregisterReceiver(it)
        }
    }

    fun handleBluetoothStateChange(state: Int) {
        when (state) {
            BluetoothAdapter.STATE_ON -> {
                onBluetoothEnabled()
            }
            BluetoothAdapter.STATE_OFF -> {
                onBluetoothDisabled()
            }
        }
    }

}