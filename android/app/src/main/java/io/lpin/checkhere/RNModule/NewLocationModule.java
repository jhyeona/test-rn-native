package io.lpin.checkhere.RNModule;

import static io.lpin.checkhere.RNModule.NewLocationHelper.locationToMap;
import static io.lpin.checkhere.RNModule.NewLocationManager.removeObserveLocationListeners;
import static io.lpin.checkhere.RNModule.NewLocationManager.requestGPSLocation;
import static io.lpin.checkhere.RNModule.NewLocationManager.requestGetLocation;
import static io.lpin.checkhere.RNModule.NewLocationManager.requestPassiveLocation;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;
import io.lpin.checkhere.RNModule.NewLocationManager.LocationOptions;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;

public class NewLocationModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private LocationManager locationManager;
  private FusedLocationProviderClient fusedLocationClient;
  private LocationListener passiveLocationListener;
  private LocationListener networkLocationListener;
  private LocationListener gpsLocationListener;
  private LocationCallback fusedLocationCallback;

  private boolean isRequestInProgress = false;

  // observing
  private LocationCallback observeFusedLocationCallback;
  private LocationListener observeLocationListener;

  private final static String EVENT_OBSERVE_LOCATION = "EVENT_OBSERVE_LOCATION";
  private final static String DID_CHANGE_LOCATION = "DID_CHANGE_LOCATION";


  public NewLocationModule(ReactApplicationContext reactApplicationContext) {
    super(reactApplicationContext);
    this.reactContext = reactApplicationContext;
    initializeLocation();
  }

  @NonNull
  @Override
  public String getName() {
    return "NewLocationModule";
  }

  @Override
  public void invalidate() {
    // 위치 관찰 중지 메서드 호출
    stopGetPassiveLocation();
    stopObservingLocation();
    super.invalidate();
  }

  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(int eventName) {

  }

  @ReactMethod
  public void startGetPassiveLocation(final Promise promise) {
    if (passiveLocationListener != null) {
      promise.reject("Request Denied", "패시브 위치 요청이 진행 중 입니다.");
      return;
    }
    passiveLocationListener = location -> {
      WritableMap resultMap = locationToMap(location);
      sendEvent(reactContext, DID_CHANGE_LOCATION, resultMap);
    };
    try {
      requestPassiveLocation(locationManager, passiveLocationListener);
      WritableMap map = Arguments.createMap();
      map.putString("status", "success");
      map.putString("message", "Passive Location request is started.");
      promise.resolve(map);
    } catch (SecurityException e) {
      promise.reject("Location Error", "Security Exception: Location permission not granted.");
    }
  }

  @ReactMethod
  public void stopGetPassiveLocation() {
    try {
      if (passiveLocationListener != null) {
        locationManager.removeUpdates(passiveLocationListener);
        passiveLocationListener = null;
      }
    } catch (Exception ex) {
      Log.e("stopGetPassiveLocation", Objects.requireNonNull(ex.getMessage()));
    }
  }


  @ReactMethod
  public void getGPSLocation(final Promise promise) {
    final AtomicLong lastRequestTime = new AtomicLong(0);

    if (gpsLocationListener != null
        || (SystemClock.elapsedRealtime() - lastRequestTime.get()) < 60000) {
      promise.reject("Request Denied",
          "GPS 위치 요청이 진행 중 이거나 최근에 실행되었습니다.");
      return;
    }

    gpsLocationListener = new LocationListener() {
      @Override
      public void onLocationChanged(@NonNull Location location) {
        WritableMap map = locationToMap(location);
        map.putString("Provider", LocationManager.GPS_PROVIDER);
        promise.resolve(map);
        lastRequestTime.set(SystemClock.elapsedRealtime());
        locationManager.removeUpdates(this);
      }
    };
    try {
      requestGPSLocation(locationManager, gpsLocationListener);
    } catch (SecurityException e) {
      promise.reject("Location Error", "Security Exception: Location permission not granted.");
    } finally {
      gpsLocationListener = null;
    }
  }

  @ReactMethod
  public void getLocation(ReadableMap options, final Promise promise) {
    if (isRequestInProgress) {
      promise.reject("Request Denied", "이미 위치 요청이 진행 중 입니다.");
      return;
    }

    isRequestInProgress = true;

    LocationOptions locationOptions = LocationOptions.fromReactMap(options);
    LocationRequest LocationRequest = new LocationRequest.Builder(0)
        .setMaxUpdateAgeMillis((long) locationOptions.maximumAge)
        .setPriority(locationOptions.highAccuracy ? Priority.PRIORITY_HIGH_ACCURACY
            : Priority.PRIORITY_BALANCED_POWER_ACCURACY)
        .setWaitForAccurateLocation(locationOptions.waitForAccurateLocation)
        .build();

    fusedLocationCallback = new LocationCallback() {
      @Override
      public void onLocationResult(LocationResult locationResult) {
        handleLocationResult(locationResult, promise);
      }
    };

    networkLocationListener = new LocationListener() {
      @Override
      public void onLocationChanged(@NonNull Location location) {
        handleLocationResult(location, promise);
      }
    };

    try {
      requestGetLocation(getCurrentActivity(), locationManager, networkLocationListener,
          fusedLocationClient, fusedLocationCallback, LocationRequest,
          locationOptions);
      setupTimeoutHandler(locationOptions.timeout, promise);
    } catch (Exception ex) {
      promise.reject("Location Error", ex.getMessage());
    }
  }

  @ReactMethod
  public void startObservingLocation(ReadableMap options, final Promise promise) {
    LocationOptions locationOptions = LocationOptions.fromReactMap(options);
    LocationRequest LocationRequest = new LocationRequest.Builder(locationOptions.interval)
        .setPriority(locationOptions.highAccuracy ? Priority.PRIORITY_HIGH_ACCURACY
            : Priority.PRIORITY_BALANCED_POWER_ACCURACY)
        .setWaitForAccurateLocation(locationOptions.waitForAccurateLocation)
        .build();

    observeFusedLocationCallback = new LocationCallback() {
      @Override
      public void onLocationResult(LocationResult locationResult) {
        if (locationResult != null) {
          Location location = locationResult.getLastLocation();
          WritableMap resultMap = locationToMap(location);
          sendEvent(reactContext, EVENT_OBSERVE_LOCATION, resultMap);
        } else {
          promise.reject("Location Error", "Fused Location result is null");
        }
      }
    };

    observeLocationListener = location -> {
      WritableMap resultMap = locationToMap(location);
      sendEvent(reactContext, EVENT_OBSERVE_LOCATION, resultMap);
    };

    try {
      requestGetLocation(getCurrentActivity(), locationManager, observeLocationListener,
          fusedLocationClient, observeFusedLocationCallback, LocationRequest,
          locationOptions);

      WritableMap requestResult = Arguments.createMap();
      requestResult.putString("status", "success");
      requestResult.putString("message", "Observing Location is started.");
      promise.resolve(requestResult);
    } catch (Exception ex) {
      promise.reject("Location Error", ex.getMessage());
    }
  }

  @ReactMethod
  public void stopObservingLocation() {
    try {
      removeObserveLocationListeners(locationManager, observeLocationListener,
          fusedLocationClient, observeFusedLocationCallback);
      observeLocationListener = null;
      observeFusedLocationCallback = null;
    } catch (Exception ex) {
      Log.e("stopObservingLocation", Objects.requireNonNull(ex.getMessage()));
    }
  }

  private void initializeLocation() {
    this.locationManager = (LocationManager) reactContext.getSystemService(
        Context.LOCATION_SERVICE);
    List<String> availableProviders = this.locationManager.getAllProviders();
    Log.d("NewLocationModule", "availableProviders: " + availableProviders);
    fusedLocationClient = LocationServices.getFusedLocationProviderClient(reactContext);

    networkLocationListener = null;
    gpsLocationListener = null;
    fusedLocationCallback = null;
  }

  private void sendEvent(ReactApplicationContext reactContext, String eventName,
      @Nullable WritableMap params) {
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  private void handleLocationResult(LocationResult locationResult, Promise promise) {
    if (locationResult != null) {
      Location location = locationResult.getLastLocation();
      if (location != null) {
        WritableMap resultMap = locationToMap(location);
        cleanupRequestLocationListeners();
        promise.resolve(resultMap);
      } else {
        cleanupRequestLocationListeners();
        promise.reject("Location Error", "Location result is null");
      }
    }
  }

  private void handleLocationResult(Location location, Promise promise) {
    if (location != null) {
      WritableMap resultMap = locationToMap(location);
      cleanupRequestLocationListeners();
      promise.resolve(resultMap);
    } else {
      cleanupRequestLocationListeners();
      promise.reject("Location Error", "Location is null");
    }
  }

  private void setupTimeoutHandler(long timeout, Promise promise) {
    new Handler(Looper.getMainLooper()).postDelayed(() -> {
      if (fusedLocationCallback != null || networkLocationListener != null) {
        cleanupRequestLocationListeners();
        promise.reject("Location Error", "Location request timed out.");
      }
    }, timeout);
  }

  private void cleanupRequestLocationListeners() {
    if (fusedLocationCallback != null) {
      fusedLocationClient.removeLocationUpdates(fusedLocationCallback);
      fusedLocationCallback = null;
    }
    if (networkLocationListener != null) {
      locationManager.removeUpdates(networkLocationListener);
      networkLocationListener = null;
    }
    if (gpsLocationListener != null) {
      locationManager.removeUpdates(gpsLocationListener);
      gpsLocationListener = null;
    }
    isRequestInProgress = false;
  }

}
