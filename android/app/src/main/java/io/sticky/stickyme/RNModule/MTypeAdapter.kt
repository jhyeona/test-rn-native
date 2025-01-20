import com.google.gson.TypeAdapter
import io.sticky.stickyme.RNModule.Ble
import io.sticky.stickyme.RNModule.CellInfo
import io.sticky.stickyme.RNModule.RequestEscapeCheck
import io.sticky.stickyme.RNModule.Schedule
import io.sticky.stickyme.RNModule.Wifi

class MTypeAdapter : TypeAdapter<RequestEscapeCheck>() {
    override fun write(out: com.google.gson.stream.JsonWriter, value: RequestEscapeCheck?) {
        if (value == null) {
            out.nullValue()
            return
        }

        out.beginObject()
        out.name("list")
        out.beginArray()

        value.list.forEach { schedule ->
            out.beginObject()
            out.name("scheduleId").value(schedule.scheduleId)
            out.name("latitude").value(schedule.latitude)
            out.name("longitude").value(schedule.longitude)
            out.name("altitude").value(schedule.altitude)

            // Serialize Wifis
            out.name("wifis")
            out.beginArray()
            schedule.wifis.forEach { wifi ->
                out.beginObject()
                out.name("ssid").value(wifi.ssid)
                out.name("bssid").value(wifi.bssid)
                out.name("rssi").value(wifi.rssi)
                out.endObject()
            }
            out.endArray()

            // Serialize Bles
            out.name("bles")
            out.beginArray()
            schedule.bles.forEach { ble ->
                out.beginObject()
                out.name("uuid").value(ble.uuid)
                out.name("major").value(ble.major)
                out.name("minor").value(ble.minor)
                out.name("rssi").value(ble.rssi)
                out.endObject()
            }
            out.endArray()

            // Serialize CellInfos
            out.name("cellInfos")
            out.beginArray()
            schedule.cellInfos.forEach { cell ->
                out.beginObject()
                out.name("mcc").value(cell.mcc)
                out.name("mnc").value(cell.mnc)
                out.name("tac").value(cell.tac)
                out.name("ci").value(cell.ci)
                out.name("pci").value(cell.pci)
                out.name("rssi").value(cell.rssi)
                out.endObject()
            }
            out.endArray()

            out.name("timeCheck").value(schedule.timeCheck)
            out.name("errorMessage").value(schedule.errorMessage)
            out.endObject()
        }

        out.endArray()
        out.endObject()
    }

    override fun read(`in`: com.google.gson.stream.JsonReader): RequestEscapeCheck {
        val schedules = mutableListOf<Schedule>()

        `in`.beginObject()
        while (`in`.hasNext()) {
            when (`in`.nextName()) {
                "list" -> {
                    `in`.beginArray()
                    while (`in`.hasNext()) {
                        var scheduleId = ""
                        var latitude = 0f
                        var longitude = 0f
                        var altitude = 0f
                        val wifis = mutableListOf<Wifi>()
                        val bles = mutableListOf<Ble>()
                        val cellInfos = mutableListOf<CellInfo>()
                        var timeCheck = ""
                        var errorMessage = ""

                        `in`.beginObject()
                        while (`in`.hasNext()) {
                            when (`in`.nextName()) {
                                "scheduleId" -> scheduleId = `in`.nextString()
                                "latitude" -> latitude = `in`.nextDouble().toFloat()
                                "longitude" -> longitude = `in`.nextDouble().toFloat()
                                "altitude" -> altitude = `in`.nextDouble().toFloat()
                                "wifis" -> {
                                    `in`.beginArray()
                                    while (`in`.hasNext()) {
                                        var ssid = ""
                                        var bssid = ""
                                        var rssi = 0
                                        `in`.beginObject()
                                        while (`in`.hasNext()) {
                                            when (`in`.nextName()) {
                                                "ssid" -> ssid = `in`.nextString()
                                                "bssid" -> bssid = `in`.nextString()
                                                "rssi" -> rssi = `in`.nextInt()
                                                else -> `in`.skipValue()
                                            }
                                        }
                                        `in`.endObject()
                                        wifis.add(Wifi(ssid, bssid, rssi))
                                    }
                                    `in`.endArray()
                                }
                                "bles" -> {
                                    `in`.beginArray()
                                    while (`in`.hasNext()) {
                                        var uuid = ""
                                        var major = 0
                                        var minor = 0
                                        var rssi = 0
                                        `in`.beginObject()
                                        while (`in`.hasNext()) {
                                            when (`in`.nextName()) {
                                                "uuid" -> uuid = `in`.nextString()
                                                "major" -> major = `in`.nextInt()
                                                "minor" -> minor = `in`.nextInt()
                                                "rssi" -> rssi = `in`.nextInt()
                                                else -> `in`.skipValue()
                                            }
                                        }
                                        `in`.endObject()
                                        bles.add(Ble(uuid, major, minor, rssi))
                                    }
                                    `in`.endArray()
                                }
                                "cellInfos" -> {
                                    `in`.beginArray()
                                    while (`in`.hasNext()) {
                                        var mcc = ""
                                        var mnc = ""
                                        var tac = ""
                                        var ci = ""
                                        var pci = ""
                                        var rssi = 0
                                        `in`.beginObject()
                                        while (`in`.hasNext()) {
                                            when (`in`.nextName()) {
                                                "mcc" -> mcc = `in`.nextString()
                                                "mnc" -> mnc = `in`.nextString()
                                                "tac" -> tac = `in`.nextString()
                                                "ci" -> ci = `in`.nextString()
                                                "pci" -> pci = `in`.nextString()
                                                "rssi" -> rssi = `in`.nextInt()
                                                else -> `in`.skipValue()
                                            }
                                        }
                                        `in`.endObject()
                                        cellInfos.add(CellInfo(mcc, mnc, tac, ci, pci, rssi))
                                    }
                                    `in`.endArray()
                                }
                                "timeCheck" -> timeCheck = `in`.nextString()
                                "errorMessage" -> errorMessage = `in`.nextString()
                                else -> `in`.skipValue()
                            }
                        }
                        `in`.endObject()
                        schedules.add(Schedule(scheduleId, latitude, longitude, altitude, wifis, bles, cellInfos, timeCheck, errorMessage))
                    }
                    `in`.endArray()
                }
                else -> `in`.skipValue()
            }
        }
        `in`.endObject()

        return RequestEscapeCheck(schedules)
    }

}