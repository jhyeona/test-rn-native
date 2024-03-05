package io.lpin.checkhere.RNModule;

import android.Manifest.permission;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanSettings;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public final class BeaconModuleHelper {
  public static boolean checkPermissions(Activity activity) {
    // SDK 31 이상에서 필요한 권한 체크
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      return ActivityCompat.checkSelfPermission(activity, permission.BLUETOOTH_SCAN)
          == PackageManager.PERMISSION_GRANTED
          && ActivityCompat.checkSelfPermission(activity, permission.BLUETOOTH_CONNECT)
          == PackageManager.PERMISSION_GRANTED
          && ActivityCompat.checkSelfPermission(activity, permission.ACCESS_FINE_LOCATION)
          == PackageManager.PERMISSION_GRANTED;
    }
    // SDK 31 미만에서 필요한 권한 체크
    else {
      return ActivityCompat.checkSelfPermission(activity, permission.ACCESS_FINE_LOCATION)
          == PackageManager.PERMISSION_GRANTED;
    }
  }

  public static List<ScanFilter> getScanFilter(String[] filterUuids, int BeaconCompanyId) {
    final List<ScanFilter> scanFilters = new ArrayList<>();
    if (filterUuids != null) {
      for (String revertUuid : filterUuids) {
        byte[] manufacturerData = new byte[18]; // 전체 길이는 18 바이트 (UUID가 2번째부터 17번째에 위치)
        byte[] manufacturerDataMask = new byte[18];
        Arrays.fill(manufacturerDataMask, (byte) 0x00); // 먼저 모든 값을 0으로 설정

        // UUID를 바이트 배열로 변환
        byte[] uuidBytes = BeaconModuleHelper.uuidStringToByteArray(revertUuid);
        System.arraycopy(uuidBytes, 0, manufacturerData, 2, 16); // 2번째부터 UUID 바이트 복사
        Arrays.fill(manufacturerDataMask, 2, 18, (byte) 0xFF); // 2번째부터 17번째까지만 비교 대상으로 설정

        ScanFilter.Builder builder = new ScanFilter.Builder();
        builder.setManufacturerData(BeaconCompanyId, manufacturerData, manufacturerDataMask);
        scanFilters.add(builder.build());
      }
    }
    return scanFilters;
  }

  public static ScanSettings getScanSettings() {
    @SuppressLint("InlinedApi") final ScanSettings scanSettings = new ScanSettings.Builder()
        .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
        .setMatchMode(ScanSettings.MATCH_MODE_AGGRESSIVE)
        .setCallbackType(ScanSettings.CALLBACK_TYPE_ALL_MATCHES)
        .setNumOfMatches(ScanSettings.MATCH_NUM_ONE_ADVERTISEMENT)
        .setReportDelay(0)
        .build();
    return scanSettings;
  }

  private static byte[] uuidStringToByteArray(String uuidString) {
    String sanitizedUuid = uuidString.replace("-", ""); // 하이픈 제거
    byte[] byteArray = new byte[16]; // UUID는 16바이트

    for (int i = 0; i < byteArray.length; i++) {
      int index = i * 2;
      int value = Integer.parseInt(sanitizedUuid.substring(index, index + 2), 16);
      byteArray[i] = (byte) value;
    }

    return byteArray;
  }

  /**
   * TX Power와 RSSI 값을 이용하여 거리를 계산합니다.
   */
  public static double calculateDistance(int txPower, int rssi) {
    if (rssi == 0 || txPower == -1) {
      return -1.0;
    }

    double ratio = rssi / (double) txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    }
  }
}