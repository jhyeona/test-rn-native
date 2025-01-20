package io.sticky.stickyme.RNModule

data class Wifi(
    val ssid: String,
    val bssid: String,
    val rssi: Int
)

data class Ble(
    val uuid: String,
    val major: Int,
    val minor: Int,
    val rssi: Int
)

data class CellInfo(
    val mcc: String,
    val mnc: String,
    val tac: String,
    val ci: String,
    val pci: String,
    val rssi: Int
)

data class Schedule(
    val scheduleId: String,
    val latitude: Float,
    val longitude: Float,
    val altitude: Float,
    val wifis: List<Wifi>,
    val bles: List<Ble>,
    val cellInfos: List<CellInfo>,
    val timeCheck: String,
    val errorMessage: String
)

data class RequestEscapeCheck(
    val list: List<Schedule>
)