package io.sticky.stickyme.RNModule

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import io.sticky.android.sdk.stickySDK
import io.sticky.android.sdk.modules.scanner.domain.entity.BeaconEntity
import io.sticky.android.sdk.modules.scanner.domain.entity.WifiEntity
import io.sticky.stickyme.R
import io.sticky.stickyme.RNModule.NativeSDKScannerModule.Companion

class ForegroundService: Service() {
    companion object {
        const val CHANNEL_ID = "ForegroundServiceChannel"
        const val NOTIFICATION_ID = 1
    }

    override fun onCreate() {
        super.onCreate()
    }

    private fun ArrayList<*>.toReadableArray(): WritableNativeArray {
        val array = WritableNativeArray()
        for (item in this) {
            when (item) {
                is HashMap<*, *> -> array.pushMap(item.toReadableMap())
                is ArrayList<*> -> array.pushArray(item.toReadableArray())
                is Boolean -> array.pushBoolean(item)
                is Double -> array.pushDouble(item)
                is Int -> array.pushInt(item)
                is String -> array.pushString(item)
                else -> array.pushString(item.toString()) // 기타 값 처리
            }
        }
        return array
    }
    private fun HashMap<*, *>.toReadableMap(): ReadableMap {
        val map = WritableNativeMap()
        for ((key, value) in this) {
            when (value) {
                is HashMap<*, *> -> map.putMap(key as String, value.toReadableMap())
                is ArrayList<*> -> map.putArray(key as String, value.toReadableArray())
                is Boolean -> map.putBoolean(key as String, value)
                is Double -> map.putDouble(key as String, value)
                is Int -> map.putInt(key as String, value)
                is String -> map.putString(key as String, value)
                else -> map.putString(key as String, value.toString()) // 기타 값 처리
            }
        }
        return map
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return try {
            val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("안전하고 정확한 출석을 위해 여기여기붙어라 실행중")
                .setContentText("실행중인 앱을 완전히 종료하지 마세요.")
                .setSmallIcon(R.drawable.ic_main_playstore)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .build()

            startForeground(NOTIFICATION_ID, notification)

            val items = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                intent?.extras?.getSerializable("apiItems", HashMap::class.java)
            } else {
                @Suppress("DEPRECATION")
                intent?.extras?.getSerializable("apiItems") as? HashMap<*, *>
            }

            val reactContext = NativeSDKScannerModule.reactContext
            if (items != null && reactContext != null) {
                val apiItems = items.toReadableMap()
                val promise = createPromise()
                val coroutine = NativeSDKScannerModule.coroutineScope
                val scannerModule = ForegroundServiceHelper(reactContext)
                scannerModule.escapeCheck(apiItems, promise, coroutine)
            }

            Log.d(":: FGS", "ON START COMMAND")
            START_STICKY
        } catch (e: Exception) {
            Log.e(":: FGS", "Error in onStartCommand", e)
            START_NOT_STICKY
        }
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onDestroy() {
        super.onDestroy()
    }

    // Promise 생성
    private fun createPromise(): Promise {
        return object : Promise {
            override fun resolve(value: Any?) {
                Log.d(":: PROMISE", "Resolved with value: $value")
            }

            override fun reject(message: String) {
                Log.e(":: PROMISE", "Rejected with message: $message")
            }

            override fun reject(code: String, userInfo: WritableMap) {
                Log.e(":: PROMISE", "Rejected with code: $code, userInfo: $userInfo")
            }

            override fun reject(code: String, message: String?) {
                Log.e(":: PROMISE", "Rejected with code: $code, message: $message")
            }

            override fun reject(code: String, message: String?, userInfo: WritableMap) {
                Log.e(":: PROMISE", "Rejected with code: $code, message: $message, userInfo: $userInfo")
            }

            override fun reject(code: String, message: String?, throwable: Throwable?) {
                Log.e(":: PROMISE", "Rejected with code: $code, message: $message", throwable)
            }

            override fun reject(code: String, throwable: Throwable?) {
                Log.e(":: PROMISE", "Rejected with code: $code", throwable)
            }

            override fun reject(code: String, throwable: Throwable?, userInfo: WritableMap) {
                Log.e(":: PROMISE", "Rejected with code: $code, throwable: $throwable, userInfo: $userInfo")
            }

            override fun reject(
                code: String?,
                message: String?,
                throwable: Throwable?,
                userInfo: WritableMap?
            ) {
                Log.e(":: PROMISE", "Rejected with code: $code, message: $message, throwable: $throwable, userInfo: $userInfo")
            }

            override fun reject(throwable: Throwable) {
                Log.e(":: PROMISE", "Rejected with throwable: $throwable")
            }

            override fun reject(throwable: Throwable, userInfo: WritableMap) {
                Log.e(":: PROMISE", "Rejected with throwable: $throwable, userInfo: $userInfo")
            }
        }
    }


}


object NotificationUtil {
    fun createNotificationChannel(context: ReactApplicationContext) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                "ForegroundServiceChannel",
                "Stickyme Foreground Service",
                NotificationManager.IMPORTANCE_HIGH
            )

            val manager = context.getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(serviceChannel)
        }
    }
}
