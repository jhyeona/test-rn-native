//
//  LocationModule.swift
//  imhereV2
//
//  Created by ImDokyun on 2022/06/09.
//

import Foundation
import CoreLocation
import NetworkExtension
import SystemConfiguration.CaptiveNetwork

@objc(LocationModule)
class LocationModule: NSObject, CLLocationManagerDelegate {
  
  let locationManager = CLLocationManager()
  
  @objc
  func getCell(_ resolve: RCTPromiseResolveBlock,
                   rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve([])
  }
  
  @objc
  func getGpsLocation(_ resolve: RCTPromiseResolveBlock,
                       rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard CLLocationManager.locationServicesEnabled() else {
      reject("-1", "위치 정보를 조죄할 수 없습니다.", nil)
      return
    }
    
    var location :Dictionary = [String: Double]()
    
    locationManager.delegate = self
    locationManager.desiredAccuracy = kCLLocationAccuracyBest
    
    locationManager.requestWhenInUseAuthorization()
    
    locationManager.startUpdatingLocation()
    
    let coordinate = locationManager.location?.coordinate
    
    locationManager.stopUpdatingLocation()
    
    if coordinate == nil {
      reject("-1", "위치 정보를 조회할 수 없습니다.", nil)
      return
    }
    
    location = [
      "latitude": coordinate!.latitude,
      "longitude": coordinate!.longitude,
      "altitude": locationManager.location!.altitude,
      "accuracy": locationManager.location!.horizontalAccuracy
    ]
    
    resolve(location)
  }
  
  @objc
  func getWifiList(_ resolve: RCTPromiseResolveBlock,
               rejecter reject: RCTPromiseRejectBlock) -> Void {
    var wifiDataList :Array = [Dictionary<String, Any>]()
    var wifiDataJson :Data? = nil
    
    wifiDataList = scanWifiList()
    
    wifiDataJson = try? JSONSerialization.data(withJSONObject: wifiDataList)
    
    if(wifiDataJson == nil) {
      reject("-1", "WiFi 정보를 수집할 수 없습니다.", nil)
      return
    }
    
    resolve(wifiDataList)
  }
  
  @objc
  func getConnectedWifi(_ resolve: RCTPromiseResolveBlock,
               rejecter reject: RCTPromiseRejectBlock) -> Void {
    var ssid :String = ""
    var bssid : String = ""
    
    (ssid, bssid) = scanConnectedWifiInfo()
    
    let wifiData :Dictionary<String, Any> = [
      "ssid": ssid,
      "bssid": bssid,
      "rssi": 0
    ]
    
    resolve(wifiData)
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
  }
}
