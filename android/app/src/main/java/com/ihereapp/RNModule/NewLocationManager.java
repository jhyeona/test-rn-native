package com.ihereapp.RNModule;

import static com.ihereapp.RNModule.NewLocationHelper.checkFusedLocationAvailability;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Looper;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;


public final class NewLocationManager {

  private static final float RCT_DEFAULT_LOCATION_ACCURACY = 100;
  private static final float RCT_DEFAULT_MAX_UPDATE_AGE_MS = -1;

  public static void requestPassiveLocation(LocationManager locationManager,
      LocationListener passiveLocationListener) {
    try {
      if(!locationManager.isProviderEnabled(LocationManager.PASSIVE_PROVIDER)) {
        throw new SecurityException("Passive Location Provider is not enabled.");
      }
      locationManager.requestLocationUpdates(LocationManager.PASSIVE_PROVIDER, 1000, 0,
          passiveLocationListener, Looper.getMainLooper());
    } catch (SecurityException e) {
      throw new SecurityException("Location permission not granted.");
    }
  }

  public static void requestNetworkLocation(LocationManager locationManager,
      LocationListener networkLocationListener) {
    try {
      if(!locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
        throw new SecurityException("Network Location Provider is not enabled.");
      }
      locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 0,
          networkLocationListener, Looper.getMainLooper());
    } catch (SecurityException e) {
      throw new SecurityException("Location permission not granted.");
    }
  }

  public static void requestGPSLocation(LocationManager locationManager,
      LocationListener gpsLocationListener) {
    try {
      if(!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
        throw new SecurityException("GPS Location Provider is not enabled.");
      }
      locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 0,
          gpsLocationListener, Looper.getMainLooper());
    } catch (SecurityException e) {
      throw new SecurityException("Location permission not granted.");
    }
  }

  @SuppressLint("MissingPermission")
  public static void requestFusedLocation(FusedLocationProviderClient fusedLocationClient,
      LocationCallback fusedLocationCallback, LocationRequest locationRequest, Looper looper) {
    try {
      fusedLocationClient.requestLocationUpdates(locationRequest, fusedLocationCallback,
              looper)
          .addOnFailureListener(e -> {
            throw new Error(e.getMessage());
          });
    } catch (Exception e) {
      throw new SecurityException(e.getMessage());
    }
  }

  public static void requestGetLocation(Activity activity, LocationManager locationManager,
      LocationListener locationListener,
      FusedLocationProviderClient fusedLocationClient,
      LocationCallback fusedLocationCallback, LocationRequest locationRequest,
      LocationOptions locationOptions
     ) {
    try {
      Location lastLocation = getLastLocation(locationManager,locationOptions);
      if (lastLocation != null) {
        locationListener.onLocationChanged(lastLocation);
        return;
      }
      // Check if Google Play Services is available and useFusedApi is true
      if (locationOptions.useFused && checkFusedLocationAvailability(activity)) {
        Log.d("LocationManager", "Using Fused Location Provider");
        requestFusedLocation(fusedLocationClient, fusedLocationCallback, locationRequest,
            Looper.getMainLooper());
      } else {
        // Use GPS and Network Providers
        requestNetworkLocation(locationManager, locationListener);
        requestGPSLocation(locationManager, locationListener);
      }
    } catch (SecurityException se) {
      // Handle exception
      Log.e("LocationManager", "Security Exception", se);
    }

  }

  public static void removeObserveLocationListeners(LocationManager locationManager,
      LocationListener locationListener,
      FusedLocationProviderClient fusedLocationClient,
      LocationCallback fusedLocationCallback
  ) {
    if (fusedLocationClient != null) {
      fusedLocationClient.removeLocationUpdates(fusedLocationCallback);
    }
    if (locationManager != null) {
      locationManager.removeUpdates(locationListener);
    }
  }


  public static class LocationOptions {

    protected final int interval;
    protected final int fastestInterval;
    protected final long timeout;
    protected final double maximumAge;
    protected final boolean highAccuracy;
    protected final boolean waitForAccurateLocation;
    protected final float distanceFilter;
    protected final boolean loop;
    protected final boolean useFused;

    private LocationOptions(
        int interval,
        int fastestInterval,
        long timeout,
        double maximumAge,
        boolean highAccuracy,
        boolean waitForAccurateLocation,
        float distanceFilter,
        boolean loop,
        boolean useFused
    ) {
      this.interval = interval;
      this.fastestInterval = fastestInterval;
      this.timeout = timeout;
      this.maximumAge = maximumAge;
      this.highAccuracy = highAccuracy;
      this.waitForAccurateLocation = waitForAccurateLocation;
      this.distanceFilter = distanceFilter;
      this.loop = loop;
      this.useFused = useFused;
    }

    protected static LocationOptions fromReactMap(ReadableMap map) {
      int interval =
          map.hasKey("interval") ? map.getInt("interval") : 1000;
      int fastestInterval =
          map.hasKey("fastestInterval") ? map.getInt("fastestInterval") : -1;
      long timeout =
          map.hasKey("timeout") ? (long) map.getDouble("timeout") : 1000 * 60 * 10;
      double maximumAge =
          map.hasKey("maximumAge") ? map.getDouble("maximumAge") : RCT_DEFAULT_MAX_UPDATE_AGE_MS;
      boolean highAccuracy =
          map.hasKey("enableHighAccuracy") && map.getBoolean("enableHighAccuracy");
      boolean waitForAccurateLocation =
          !map.hasKey("waitForAccurateLocation") || map.getBoolean("waitForAccurateLocation");
      float distanceFilter = map.hasKey("distanceFilter") ?
          (float) map.getDouble("distanceFilter") :
          RCT_DEFAULT_LOCATION_ACCURACY;
      boolean loop = map.hasKey("loop");
      boolean useFused = map.hasKey("useFused") && map.getBoolean("useFused");

      return new LocationOptions(interval, fastestInterval, timeout, maximumAge, highAccuracy,
          waitForAccurateLocation, distanceFilter, loop, useFused);
    }
  }
  // 지난 위치 가져오기
  @SuppressLint("MissingPermission")
  private static Location getLastLocation(LocationManager mLocationManager,  LocationOptions locationOptions) {
    Location lastLocation = mLocationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
    if (lastLocation != null) {
      long lastLocationTs = lastLocation.getTime();
      long locationAgeMs = System.currentTimeMillis() - lastLocationTs;
      if (locationAgeMs < locationOptions.maximumAge) {
        return lastLocation;
      }
    }
    return null;
  }
}
