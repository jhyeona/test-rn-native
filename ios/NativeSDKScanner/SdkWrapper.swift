//
//  stickySdkWrapper.swift
//  stickyme
//
//  Created by zoey on 1/6/25.
//

import Foundation
import sticky_ios_sdk

@objc public class SdkWrapper: NSObject {
  @objc public static let shared = SdkWrapper()
  
  private override init() {}
  
  private let sdk = stickySdk.shared
  
  // [SDK] 초기화
  @objc public func initialize(params: BuildParamsWrapper) {
    DispatchQueue.main.async {
      let buildParams = BuildParams(
          beaconUUID: params.beaconUUID ?? [],
          isWifiEnable: params.isWifiEnable,
          isLocationEnable: params.isLocationEnable,
          isBeaconEnable: params.isBeaconEnable,
          beaconTTL: params.beaconTTL
      )
      NSLog("[wrapper] buildParams: \(buildParams)")

      self.sdk.initialize(params: buildParams)
    }
  }

  // [SDK] 종료
  @objc public func deinitialize() {
    sdk.deinitialize()
  }
  
  // [SDK] 초기화 여부
  @objc public func isInitialized() -> Bool {
    return sdk.isInitialized()
  }
  
  // [SDK] Beacon 데이터 가져오기
  @objc public func getBeaconList() -> NSArray? {
    if let beaconList = sdk.getBeaconList() {
      NSLog("[wrapper] Beacon List: \(beaconList)")

      var seenKeys = Set<String>()
      var uniqueBeacons: [[String: Any]] = []

      for beacon in beaconList {
        let key = "\(beacon.uuid)-\(beacon.major ?? 0)-\(beacon.minor ?? 0)"
        NSLog("[wrapper] Beacon key: \(key)")
        
        // 중복 여부 확인
        if !seenKeys.contains(key) {
          seenKeys.insert(key)
          
          let beaconDict: [String: Any] = [
              "uuid": beacon.uuid,
              "rssi": beacon.rssi,
              "major": beacon.major ?? 0,
              "minor": beacon.minor ?? 0
          ]
          uniqueBeacons.append(beaconDict)
        } else {
          NSLog("[wrapper] Duplicate beacon ignored: \(key)")
        }
      }
      
      NSLog("[wrapper] Unique Beacon List: \(uniqueBeacons)")
      return uniqueBeacons as NSArray
    } else {
      NSLog("[wrapper] Beacon List is nil or empty")
      return []
    }
  }

  // [SDK] Wifi 데이터 가져오기
  @objc public func getWifi() -> NSString? {
    if let wifiValue = sdk.getWifi() {
      let wifiDescription = "\(wifiValue)"
      return wifiDescription as NSString
    } else {
      return "wifi is nil"
    }
  }

  // [SDK] Location 데이터 가져오기
  @objc public func getLocation() -> NSString? {
    if let location = sdk.getLocation() {
      let locationDescription = "\(location)"
      return locationDescription as NSString
    } else {
      return "location is nil"
    }
  }
  
  
  
  
  // ===== 데이터 누적 ===== //
  private var dataTimer: DispatchSourceTimer?
  private var beaconSet = Set<String>()
  private var wifiSet = Set<String>()
  private var accumulatedBeacons: [[String: Any]] = []
  private var accumulatedWifis: [[String: Any]] = []

  // 데이터 누적 시작
  @objc public func startDataAccumulation() {
      // 2분 간격 타이머
      dataTimer = DispatchSource.makeTimerSource(queue: DispatchQueue.global())
      dataTimer?.schedule(deadline: .now(), repeating: 20) // 120
      dataTimer?.setEventHandler { [weak self] in
          self?.fetchDataPeriodically()
      }
      dataTimer?.resume()
      NSLog("[wrapper] Data accumulation started.")
  }

  // 타이머 종료
  @objc public func stopDataAccumulation() {
      dataTimer?.cancel()
      dataTimer = nil
      NSLog("[wrapper] Data accumulation stopped.")
  }

  // 10초 동안 2초 간격으로 데이터 가져오기
  private func fetchDataPeriodically() {
      let group = DispatchGroup()
      for _ in 0..<5 {
          group.enter()
          DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
              self.fetchBeaconData()
              self.fetchWifiData()
              group.leave()
          }
      }
      group.notify(queue: DispatchQueue.global()) {
          NSLog("[wrapper] Finished 10-second data scan cycle")
      }
  }

  // 비콘 데이터 가져오기
  private func fetchBeaconData() {
    DispatchQueue.main.async {
      guard let beaconList = self.sdk.getBeaconList() else { return }
      for beacon in beaconList {
        let key = "\(beacon.uuid)-\(beacon.major ?? 0)-\(beacon.minor ?? 0)"
        if !self.beaconSet.contains(key) {
          self.beaconSet.insert(key)
          self.accumulatedBeacons.append([
            "uuid": beacon.uuid,
            "rssi": beacon.rssi,
            "major": beacon.major ?? 0,
            "minor": beacon.minor ?? 0
          ])
        }
      }
    }
  }

  // 와이파이 데이터 가져오기
  private func fetchWifiData() {
    DispatchQueue.main.async {
      guard let wifi = self.sdk.getWifi() else {
          NSLog("[wrapper] Wifi list is nil or empty.")
          return
      }

      let key = "\(wifi.ssid)-\(wifi.bssid)"
      if !self.wifiSet.contains(key) {
        self.wifiSet.insert(key)
        self.accumulatedWifis.append([
          "ssid": wifi.ssid,
          "bssid": wifi.bssid,
          "rssi": wifi.rssi
        ])
      }
    }
  }

  // 누적된 데이터 반환
  @objc public func getAccumulatedData() -> NSDictionary {
      let result: [String: Any] = [
          "bles": accumulatedBeacons,
          "wifis": accumulatedWifis
      ]
      return result as NSDictionary
  }

  // 누적된 데이터 초기화
  @objc public func resetAccumulatedData() {
      let result: [String: Any] = [
          "bles": accumulatedBeacons,
          "wifis": accumulatedWifis
      ]

      // 데이터 초기화
      beaconSet.removeAll()
      wifiSet.removeAll()
      accumulatedBeacons.removeAll()
      accumulatedWifis.removeAll()

      NSLog("[wrapper] Accumulated data has been reset. ") // Returning: \(result)")
//      return result as NSDictionary
  }

  
  // Location for API BODY
  @objc public func getLocationOrigin() -> NSDictionary? {
    let location = sdk.getLocation()

    let altitude = location?.alt ?? 0.0
    let latitude = location?.lat ?? 0.0
    let longitude = location?.lon ?? 0.0

    NSLog("[wrapper] Retrieved location: alt=\(altitude), lat=\(latitude), lon=\(longitude)")

    let locationDict: [String: Any] = [
      "altitude": altitude,
      "latitude": latitude,
      "longitude": longitude
    ]

    return locationDict as NSDictionary
  }
  
}
