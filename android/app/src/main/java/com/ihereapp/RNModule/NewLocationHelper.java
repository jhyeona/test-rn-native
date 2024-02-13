package com.ihereapp.RNModule;

import android.app.Activity;
import android.location.Location;
import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

public final class NewLocationHelper {

  public static boolean checkFusedLocationAvailability(Activity activity) {
    // Google Play 서비스 체크
    int playServicesStatus = GoogleApiAvailability.getInstance()
        .isGooglePlayServicesAvailable(activity);
    return playServicesStatus == ConnectionResult.SUCCESS;
  }

  private static void putIntoMap(WritableMap map, String key, Object value) {
    if (value instanceof Integer) {
      map.putInt(key, (Integer) value);
    } else if (value instanceof Long) {
      map.putInt(key, ((Long) value).intValue());
    } else if (value instanceof Float) {
      map.putDouble(key, (Float) value);
    } else if (value instanceof Double) {
      map.putDouble(key, (Double) value);
    } else if (value instanceof String) {
      map.putString(key, (String) value);
    } else if (value instanceof Boolean) {
      map.putBoolean(key, (Boolean) value);
    } else if (value instanceof int[]
        || value instanceof long[]
        || value instanceof double[]
        || value instanceof String[]
        || value instanceof boolean[]) {
      map.putArray(key, Arguments.fromArray(value));
    }
  }

  public static WritableMap locationToMap(Location location) {
    WritableMap map = Arguments.createMap();
    WritableMap coords = Arguments.createMap();
    coords.putDouble("latitude", location.getLatitude());
    coords.putDouble("longitude", location.getLongitude());
    coords.putDouble("altitude", location.getAltitude());
    coords.putDouble("accuracy", location.getAccuracy());
    coords.putDouble("heading", location.getBearing());
    coords.putDouble("speed", location.getSpeed());
    map.putMap("coords", coords);
    map.putDouble("timestamp", location.getTime());

    Bundle bundle = location.getExtras();
    if (bundle != null) {
      WritableMap extras = Arguments.createMap();
      for (String key : bundle.keySet()) {
        putIntoMap(extras, key, bundle.get(key));
      }

      map.putMap("extras", extras);
    }
    map.putString("provider", location.getProvider());
    if (VERSION.SDK_INT >= VERSION_CODES.S) {
      map.putBoolean("mocked", location.isMock());
    } else{
      map.putBoolean("mocked", location.isFromMockProvider());
    }
    return map;
  }
}
