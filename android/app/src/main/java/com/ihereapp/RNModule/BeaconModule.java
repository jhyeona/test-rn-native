package com.ihereapp.RNModule;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanRecord;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import java.util.ArrayList;
import java.util.List;


public class BeaconModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private BluetoothAdapter bluetoothAdapter;
  private BluetoothLeScanner bluetoothLeScanner;
  private ScanCallback scanCallbackListener;
  private final Intent INTENT_REQUEST_ENABLE_BLUETOOTH = new Intent(
      BluetoothAdapter.ACTION_REQUEST_ENABLE
  );
  private final static int REQUEST_ENABLE_BT = 795;
  private static final int BeaconCompanyId = 0x004C;
  private final static String EVENT_BLUETOOTH_DETECTED = "EVENT_BLUETOOTH_DETECTED";
  private Promise requestToEnablePromise;
  private boolean isBleEnabled = false;
  private boolean isScanning = false;
  private boolean hasListeners = false;
  private String[] filterUuids;


  public BeaconModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    initializeBeaconScanning();
  }


  @NonNull
  @Override
  public String getName() {
    return "BeaconModule";
  }


  @SuppressLint("MissingPermission")
  @Override
  public void invalidate() {
    if (!isScanning || !isBleEnabled) {
      return;
    }
    final BluetoothLeScanner scanner = bluetoothLeScanner;
    scanner.stopScan(scanCallbackListener);
    isScanning = false;
    super.invalidate();
  }

  @ReactMethod
  public void addListener(String eventName) {
    hasListeners = true;
  }

  @ReactMethod
  public void removeListeners(int eventName) {
    hasListeners = false;
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  public void requestToBluetoothEnable(Promise promise) {
    if (!BeaconModuleHelper.checkPermissions(getCurrentActivity())) {
      promise.reject("PERMISSION_ERROR", "Required permissions are not granted");
      return;
    }
    Activity currentActivity = this.handleCurrentActivity(promise);
    if (currentActivity == null) {
      return;
    }
    this.addRequestToEnableListener(promise);
    currentActivity.startActivityForResult(INTENT_REQUEST_ENABLE_BLUETOOTH, REQUEST_ENABLE_BT);
  }

  // 비콘 스캔 시작 및 중지 메소드
  @SuppressLint("MissingPermission")
  @ReactMethod
  public void startScanning(ReadableArray uuids, final Promise promise) {
    if (!BeaconModuleHelper.checkPermissions(getCurrentActivity())) {
      promise.reject("PERMISSION_ERROR", "Required permissions are not granted");
      return;
    }
    if (!isBleEnabled) {
      promise.reject("BLUETOOTH_ERROR", "Bluetooth is turned off");
      return;
    }
    if (isScanning) {
      promise.reject("SCAN_ERROR", "Scanner is already started");
      return;
    }

    filterUuids = new String[uuids.size()];
    for (int i = 0; i < uuids.size(); i++) {
      filterUuids[i] = uuids.getString(i);
    }
    final BluetoothLeScanner scanner = bluetoothLeScanner;

    ScanCallback scanCallback = new ScanCallback() {
      @Override
      public void onScanResult(int callbackType, ScanResult result) {
        super.onScanResult(callbackType, result);

        final WritableMap scanResult = createScanResultMap(result, uuids);
        if (scanResult != null) {
          sendEventToReactNative(scanResult);
        }
      }

      @Override
      public void onScanFailed(int errorCode) {
        super.onScanFailed(errorCode);
        isScanning = false;
        promise.reject("SCAN_FAILED", "Scan failed with error code: " + errorCode);
      }
    };

    // 스캔 시작
    scanner.startScan(BeaconModuleHelper.getScanFilter(filterUuids, BeaconCompanyId),
        BeaconModuleHelper.getScanSettings(), scanCallback);
    scanCallbackListener = scanCallback;
    isScanning = true;
    promise.resolve(true);
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  public void stopScanning(Promise promise) {
    if (!isBleEnabled) {
      promise.reject("BLUETOOTH_ERROR", "Bluetooth is turned off");
      return;
    }
    if (!isScanning) {
      promise.reject("SCAN_ERROR", "Scanner is not started");
      return;
    }
    final BluetoothLeScanner scanner = bluetoothLeScanner;
    scanner.stopScan(scanCallbackListener);
    isScanning = false;
    promise.resolve(true);
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  public void getScanResultsForDuration(double duration, final Promise promise) {
    if (!BeaconModuleHelper.checkPermissions(getCurrentActivity())) {
      promise.reject("PERMISSION_ERROR", "Required permissions are not granted");
      return;
    }
    if (!isBleEnabled) {
      promise.reject("BLUETOOTH_ERROR", "Bluetooth is turned off");
      return;
    }
    if (!isScanning) {
      promise.reject("SCAN_ERROR", "Scanner is not started");
      return;
    }

    final List<WritableMap> scanResults = new ArrayList<>();
    final BluetoothLeScanner scanner = bluetoothLeScanner;

    // 스캔 콜백 정의
    ScanCallback scanCallback = new ScanCallback() {
      @Override
      public void onScanResult(int callbackType, ScanResult result) {
        super.onScanResult(callbackType, result);
        final WritableMap scanResult = createScanResultMap(result, null);
        if (scanResult != null) {
          scanResults.add(scanResult);
        }
      }

      @Override
      public void onScanFailed(int errorCode) {
        super.onScanFailed(errorCode);
        promise.reject("SCAN_FAILED", "Scan failed with error code: " + errorCode);
      }
    };

    // 스캔 시작
    scanner.startScan(BeaconModuleHelper.getScanFilter(filterUuids, BeaconCompanyId),
        BeaconModuleHelper.getScanSettings(), scanCallback);

    // 지정된 시간 후에 스캔 중지 및 결과 반환
    new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
      @Override
      public void run() {
        if (!BeaconModuleHelper.checkPermissions(getCurrentActivity())) {
          promise.reject("PERMISSION_ERROR", "Required permissions are not granted");
          return;
        }
        scanner.stopScan(scanCallback);
        WritableArray resultsArray = Arguments.createArray();
        for (WritableMap result : scanResults) {
          resultsArray.pushMap(result);
        }
        promise.resolve(resultsArray);
      }
    }, (long) (duration * 1000));
  }


  private final ActivityEventListener requestToEnableListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
      if (requestCode != REQUEST_ENABLE_BT) {
        return;
      }
      if (requestToEnablePromise == null) {
        return;
      }
      if (resultCode == Activity.RESULT_OK) {
        requestToEnablePromise.resolve(true);
        if (!isBleEnabled && bluetoothAdapter != null) {
          isBleEnabled = bluetoothAdapter.isEnabled();
          if (isBleEnabled) {
            bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
          }
        }
      } else {
        requestToEnablePromise.reject("BLUETOOTH_DISABLED", "Bluetooth was not enabled");
      }
      removeRequestToEnableListener();
    }
  };

  private void initializeBeaconScanning() {
    // BluetoothManager  초기화
    BluetoothManager bluetoothManager = (BluetoothManager) this.reactContext.getSystemService(
        Context.BLUETOOTH_SERVICE);
    bluetoothAdapter = bluetoothManager.getAdapter();
    if (bluetoothAdapter != null) {
      isBleEnabled = bluetoothAdapter.isEnabled();
      if (isBleEnabled) {
        bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
      }
    }
  }

  private WritableMap createScanResultMap(ScanResult result, ReadableArray uuids) {
    if (result == null) {
      return null;
    }
    ScanRecord scanRecord = result.getScanRecord();
    if (scanRecord == null) {
      return null;
    }
    byte[] scanRecordBytes = result.getScanRecord().getBytes();
    int rssi = result.getRssi();
    int txPower = -1;
    if (scanRecordBytes.length > 29) {
      txPower = scanRecordBytes[29];
    }
    double distance = BeaconModuleHelper.calculateDistance(txPower, rssi);

    // UUID, Major, Minor 값 추출
    byte[] resultArray = scanRecord.getManufacturerSpecificData(BeaconCompanyId);
    if (resultArray != null && resultArray.length >= 23) {
      StringBuilder uuidBuilder = new StringBuilder();
      for (int i = 2; i <= 17; i++) {
//        Log.d("BeaconModule", "createScanResultMap: " + resultArray[i]);
        uuidBuilder.append(String.format("%02X", resultArray[i]));
        if (i == 5 || i == 7 || i == 9 || i == 11) {
          uuidBuilder.append("-");
        }
      }
      String uuid = uuidBuilder.toString();
      // uuids 에 속한 uuiud 가 아니면 return null
      if (filterUuids != null) {
        boolean isUuid = false;
        for (String filterUuid : filterUuids) {
          if (filterUuid.equalsIgnoreCase(uuid)) {
            isUuid = true;
            break;
          }
        }
        if (!isUuid) {
          return null;
        }
      }
      String major =
          String.format("%02X", resultArray[18]) + String.format("%02X", resultArray[19]);
      String minor =
          String.format("%02X", resultArray[20]) + String.format("%02X", resultArray[21]);

      // 16진수 문자열을 정수로 변환
      int majorValue = Integer.parseInt(major, 16);
      int minorValue = Integer.parseInt(minor, 16);

      // 정수 값을 다시 문자열로 변환
      String majorDecimal = String.valueOf(majorValue);
      String minorDecimal = String.valueOf(minorValue);

      WritableMap params = Arguments.createMap();
      params.putString("uuid", uuid);
      params.putString("mac", result.getDevice().getAddress());
      params.putString("major", majorDecimal);
      params.putString("minor", minorDecimal);
      params.putDouble("accuracy", distance);
      params.putInt("proximity", 0);
      params.putInt("rssi", rssi);
      params.putDouble("timestamp",
          System.currentTimeMillis());
      return params;
    }
    return null;
  }



  // 비콘 스캔 결과를 React Native로 보내는 메소드
  private void sendEventToReactNative(Object params) {
    if (hasListeners) {
      getReactApplicationContext()
          .getJSModule(RCTDeviceEventEmitter.class)
          .emit(EVENT_BLUETOOTH_DETECTED, params);
    }
  }

  private Activity handleCurrentActivity(Promise promise) {
    Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      promise.reject("INTERNAL_ERROR", "There is no activity");
    }
    return currentActivity;
  }

  // --------------------------------------------------------------------------------------------- -
  // REQUEST TO ENABLE BLUETOOTH
  private void addRequestToEnableListener(Promise promise) {
    this.requestToEnablePromise = promise;
    this.reactContext.addActivityEventListener(this.requestToEnableListener);
  }

  private void removeRequestToEnableListener() {
    this.reactContext.removeActivityEventListener(this.requestToEnableListener);
    this.requestToEnablePromise = null;
  }
}
