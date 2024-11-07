package io.lpin.checkhere.RNModule

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.CellIdentityNr
import android.telephony.CellInfoGsm
import android.telephony.CellInfoLte
import android.telephony.CellInfoNr
import android.telephony.CellInfoWcdma
import android.telephony.TelephonyManager
import android.util.Log
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.nativebaseinfo.NativeBaseInfoSpec

class NativeBaseInfoModule(reactContext: ReactApplicationContext) : NativeBaseInfoSpec(reactContext) {

    override fun getName() = NAME

    override fun getTelephoneInfo(): WritableMap {
        val telephonyManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        val networkOperator = telephonyManager.networkOperator
        val networkOperatorName = telephonyManager.networkOperatorName

        // cell(cellId, lac) 정보를 위한 ACCESS_FINE_LOCATION 권한 확인
        val hasPermission = ContextCompat.checkSelfPermission(
            reactApplicationContext, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val resultMap: WritableMap = Arguments.createMap()

        if (!hasPermission) {
            resultMap.putString("error", "Permission not granted")
            return resultMap
        }

        var mcc = "Unknown"
        var mnc = "Unknown"
        var ci = "Unknown"
        var lac = "Unknown"
        var rssi = "Unknown"
        var pci = "Unknown"
        var eci = "Unknown"
        var nci = "Unknown"

        try {
            // MCC, MNC 정보 얻기
            if (!networkOperator.isNullOrEmpty() && networkOperator.length >= 5) {
                mcc = networkOperator.substring(0, 3)
                mnc = networkOperator.substring(3)
            }

            val cellInfoList = telephonyManager.allCellInfo

            if (cellInfoList != null && cellInfoList.isNotEmpty()) {
                for (cellInfo in cellInfoList) {
                    if (cellInfo is CellInfoGsm) {
                        // 2G GSM 셀타워
                        val cellIdentity = cellInfo.cellIdentity
                        ci = cellIdentity.cid.toString()
                        lac = cellIdentity.lac.toString()

                        val cellSignalStrength = cellInfo.cellSignalStrength
                        rssi = cellSignalStrength.dbm.toString()
                        break
                    } else if (cellInfo is CellInfoWcdma) {
                        // 3G WCDMA 셀타워
                        val cellIdentity = cellInfo.cellIdentity
                        ci = cellIdentity.cid.toString()
                        lac = cellIdentity.lac.toString()

                        val cellSignalStrength = cellInfo.cellSignalStrength
                        rssi = cellSignalStrength.dbm.toString()
                        break
                    } else if (cellInfo is CellInfoLte) {
                        // 4G LTE 셀타워
                        val cellIdentity = cellInfo.cellIdentity
                        eci = cellIdentity.ci.toString() // ECI (E-UTRAN Cell Identity)
                        lac = cellIdentity.tac.toString()
                        pci = cellIdentity.pci.toString()

                        val cellSignalStrength = cellInfo.cellSignalStrength
                        rssi = cellSignalStrength.dbm.toString()
                        break
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && (cellInfo is CellInfoNr)) { // API 29 이상에서만 CellInfoNr 사용
                        // 5G NR 셀타워
                        val cellIdentityNr = cellInfo.cellIdentity as? CellIdentityNr
                        if (cellIdentityNr != null) {
                            nci = cellIdentityNr.nci.toString()
                            lac = cellIdentityNr.tac.toString()
                            pci = cellIdentityNr.pci.toString()

                            val cellSignalStrengthNr = cellInfo.cellSignalStrength
                            rssi = cellSignalStrengthNr.dbm.toString() // dBm 단위로 RSSI 값
                        }
                        break
                    }
                }
            }
        } catch (e: SecurityException) {
            resultMap.putString("error", "Failed to access cell info due to missing permissions")
            return resultMap
        }

        resultMap.putString("mcc", mcc)
        resultMap.putString("mnc", mnc)
        resultMap.putString("ci", ci)
        resultMap.putString("lac", lac)
        resultMap.putString("rssi", rssi)
        resultMap.putString("nci", nci)
        resultMap.putString("pci", pci)
        resultMap.putString("eci", eci)
        resultMap.putString("telecom", networkOperatorName)

        return resultMap
    }


    override fun setItem(value: String, key: String) {
        val sharedPref = reactApplicationContext.getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
        val editor = sharedPref.edit()
        editor.putString(key, value)
        editor.apply()
    }

    override fun getItem(key: String): String {
        val sharedPref = reactApplicationContext.getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
        val username = sharedPref.getString(key, null)
        return username.toString()
    }

    override fun removeItem(key: String) {
        val sharedPref = reactApplicationContext.getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
        val editor = sharedPref.edit()
        editor.remove(key)
        editor.apply()
    }

    override fun clear() {
        val sharedPref = reactApplicationContext.getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
        val editor = sharedPref.edit()
        editor.clear()
        editor.apply()
    }

    companion object {
        const val NAME = "NativeBaseInfo"
    }
}