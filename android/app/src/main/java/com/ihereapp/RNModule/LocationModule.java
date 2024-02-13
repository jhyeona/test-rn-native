package com.ihereapp.RNModule;

import android.content.Context;
import android.location.Location;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.List;

import io.lpin.android.sdk.plac.scanner.CellData;
import io.lpin.android.sdk.plac.scanner.LocationPackage;
import io.lpin.android.sdk.plac.scanner.Scanner;
import io.lpin.android.sdk.plac.scanner.ScannerException;
import io.lpin.android.sdk.plac.scanner.ScannerListener;
import io.lpin.android.sdk.plac.scanner.ScannerParams;
import io.lpin.android.sdk.plac.scanner.WifiData;

public class LocationModule extends ReactContextBaseJavaModule {
    public LocationModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @ReactMethod
    public String getName() {
        return "LocationModule";
    }

    @ReactMethod
    public void getCell(final Promise promise) {
        ScannerParams scannerParams = new ScannerParams.Builder()
                .setBluetoothScanEnabled(false)
                .setWifiScanEnabled(false)
                .setLocationScanEnabled(false)
                .setCellScanEnable(true)
                .build();

        new Scanner.Builder(getReactApplicationContext())
                .setScannerParams(scannerParams)
                .setScannerListener(new ScannerListener() {
                    @Override
                    public void onLocationFailure(ScannerException e) {
                        promise.reject("-1", "기지국 정보를 조회할 수 없습니다.");
                        return;
                    }

                    @Override
                    public void onLocationPackage(LocationPackage locationPackage) {
                        try {
                            CellData cellData = locationPackage.getCell();

                            if (cellData == null) {
                                promise.reject("-1", "기지국 정보를 조회할 수 없습니다.");
                                return;
                            }

                            WritableNativeArray cellList = new WritableNativeArray();
                            WritableNativeMap cell = new WritableNativeMap();

                            cell.putString("mcc", cellData.getMcc());
                            cell.putString("mnc", cellData.getMnc());
                            cell.putDouble("lac", cellData.getLac());
                            cell.putDouble("cellId", cellData.getCid());
                            cell.putString("telecom", cellData.getTelecom());

                            cellList.pushMap(cell);

                            promise.resolve(cellList);

                            return;
                        } catch (Exception e) {
                            promise.reject("-1", "기지국 정보를 조회할 수 없습니다.");
                            // ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
                            return;
                        }
                    }
                })
                .build()
                .run();
    }

    @Deprecated
    @ReactMethod
    public void getGpsLocation(final Promise promise) {
        ScannerParams scannerParams = new ScannerParams.Builder()
                .setCellScanEnable(false)
                .setBluetoothScanEnabled(false)
                .setWifiScanEnabled(false)
                .build();

        new Scanner.Builder(getReactApplicationContext())
                .setScannerParams(scannerParams)
                .setScannerListener(new ScannerListener() {
                    @Override
                    public void onLocationFailure(ScannerException e) {
                        promise.reject("-1", "위치 정보를 조회할 수 없습니다.");
                        // ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
                    }

                    @Override
                    public void onLocationPackage(LocationPackage locationPackage) {
                        try {
                            Location location = locationPackage.getLocation();
                            if (location == null) {
                                promise.reject("-1", "위치 정보를 조회할 수 없습니다.");
                                return;
                            }

                            WritableNativeMap locationNativeMap = new WritableNativeMap();
                            locationNativeMap.putDouble("longitude", location.getLongitude());
                            locationNativeMap.putDouble("latitude", location.getLatitude());
                            locationNativeMap.putDouble("altitude", location.getAltitude());
                            locationNativeMap.putDouble("accuracy", location.getAccuracy());

                            promise.resolve(locationNativeMap);
                        } catch (Exception e) {
                            promise.reject("-1", "위치 정보를 조회할 수 없습니다.");
                            // ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
                        }
                    }
                })
                .build()
                .run();
    }

    @ReactMethod
    public void getWifiList(final Promise promise) {
        ScannerParams scannerParams = new ScannerParams.Builder()
                .setCellScanEnable(false)
                .setBluetoothScanEnabled(false)
                .setLocationScanEnabled(false)
                .build();

        new Scanner.Builder(getReactApplicationContext())
                .setScannerParams(scannerParams)
                .setScannerListener(new ScannerListener() {
                    @Override
                    public void onLocationFailure(ScannerException e) {
                        promise.reject("-1", "WiFi 정보를 수집할 수 없습니다.");
                        // ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
                    }

                    @Override
                    public void onLocationPackage(LocationPackage locationPackage) {
                        try {
                            List<WifiData> wifiDataList = locationPackage.getWifiScanResults();

                            if (wifiDataList == null) {
                                promise.reject("-1", "WiFi 정보를 수집할 수 없습니다.");
                                return;
                            }

                            WritableNativeArray wifiDataNativeArray = new WritableNativeArray();

                            for (WifiData wifi : wifiDataList) {
                                WritableNativeMap wifiNativeMap = new WritableNativeMap();
                                wifiNativeMap.putString("ssid", wifi.getSsid());
                                wifiNativeMap.putString("bssid", wifi.getBssid());
                                wifiNativeMap.putInt("rssi", wifi.getRssi());

                                wifiDataNativeArray.pushMap(wifiNativeMap);
                            }

                            promise.resolve(wifiDataNativeArray);
                        } catch (Exception e) {
                            promise.reject("-1", "WiFi 정보를 수집할 수 없습니다.");
                            // ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
                        }
                    }
                })
                .build()
                .run();
    }

    @ReactMethod
    public void getConnectedWifi(final Promise promise) {
        try {
            ReactApplicationContext reactApplicationContext = getReactApplicationContext();
            Context context = reactApplicationContext.getApplicationContext();

            WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();

            WritableNativeMap connectedWifiInfo = new WritableNativeMap();

            connectedWifiInfo.putString("ssid", wifiInfo.getSSID().substring(1, wifiInfo.getSSID().length() - 1));
            connectedWifiInfo.putString("bssid", wifiInfo.getBSSID());
            connectedWifiInfo.putInt("rssi", wifiInfo.getRssi());

            promise.resolve(connectedWifiInfo);
        } catch (Exception e) {
            promise.reject("-1", "WiFi 정보를 수집할 수 없습니다.");
            // ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
        }
    }
}
