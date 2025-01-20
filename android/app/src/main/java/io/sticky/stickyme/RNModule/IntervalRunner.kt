package io.sticky.stickyme.RNModule

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactApplicationContext

class IntervalRunner(
    reactApplicationContext: ReactApplicationContext
) {
    private val fgHelper = ForegroundServiceHelper(reactApplicationContext)

    private val handler = Handler(Looper.getMainLooper())
    private var count = 0
    private var isRunning = false
    private var currentRunnable: Runnable? = null
    private var currentAction: ((Int) -> Unit)? = null
    private var endTime: Double = 0.0

    fun start(
        intervalSeconds: Double,
        newEndTime: Double,
        action: (Int) -> Unit,
    ) {
        // 기존 실행 중인 작업 중지
        if (isRunning) {
            stop()
        }

        // 새로운 종료 시간 및 콜백 설정
        endTime = newEndTime
        currentAction = action

        if (intervalSeconds < 1) {
            throw IllegalArgumentException("IntervalSeconds must be at least 1 second")
        }

        val intervalMillis = (intervalSeconds * 1000).toLong()
        val currentTime = System.currentTimeMillis() / 1000.0
        val remainingTime = ((endTime - currentTime) * 1000).toLong()

        if (remainingTime <= 0) {
            throw IllegalArgumentException("EndTime must be in the future")
        }

        isRunning = true
        count = 0

        // 새 Runnable 정의 및 등록
        currentRunnable = object : Runnable {
            override fun run() {
                if (!isRunning) return

                count++
                currentAction?.invoke(count) // Action 실행

                if (System.currentTimeMillis() / 1000.0 >= endTime) {
                    stop()
                } else {
                    handler.postDelayed(this, intervalMillis)
                }
            }
        }

        handler.post(currentRunnable!!)
    }

    fun stop() {
        // 실행 중지
        isRunning = false

        // 기존 Runnable 제거
        currentRunnable?.let { handler.removeCallbacks(it) }
        currentRunnable = null
        currentAction = null

        val serviceIntent = NativeSDKScannerModule.serviceIntent
        fgHelper.stopForegroundService(serviceIntent)
    }
}
