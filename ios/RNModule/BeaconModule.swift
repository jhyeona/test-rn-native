//
//  BeaconModule.swift
//  imhereV2
//
//  Created by rudy.lee on 11/13/23.
//

import Foundation
import CoreLocation


@objc(BeaconModule)
class BeaconModule: RCTEventEmitter, CLLocationManagerDelegate {
  
  enum MonitoringError: Error {
    case locationManagerUnavailable
    case monitoringFailed
    case rangingFailed
  }
  enum ScannerError: Error {
    case scannerNotActive
  }
  
  private var locationManager: CLLocationManager?
  private var beaconRegions: [CLBeaconRegion] = []
  private var scanResultsHandler: RCTResponseSenderBlock?
  
  private var promiseResolve: RCTPromiseResolveBlock?
  private var promiseReject: RCTPromiseRejectBlock?
  private var temporaryBeacons: [CLBeacon] = []
  
  private var hasListeners: Bool = false // 이벤트 리스너 등록 여부 추적

  
  // 위치 관리자 초기화
  override init() {
    super.init()
    locationManager = CLLocationManager()
    locationManager?.delegate = self
    checkAndRequestLocationPermission()
  }
  
  // TODO: 위치 권한 체크 및 Reject 처리
  private func checkAndRequestLocationPermission() {
    let status = CLLocationManager.authorizationStatus()
    if status == .notDetermined {
      locationManager?.requestAlwaysAuthorization()
    } else if status == .denied || status == .restricted {
      // Handle permission denied case
    }
  }
  
  // 주어진 비콘 영역 모니터링 시작
  private func startMonitoring(beaconRegion: CLBeaconRegion) throws {
    guard let locationManager = locationManager else {
      throw MonitoringError.locationManagerUnavailable
    }
    
    locationManager.startMonitoring(for: beaconRegion)
    locationManager.startRangingBeacons(satisfying: CLBeaconIdentityConstraint(uuid: beaconRegion.uuid))
  }
  
  // 비콘 스캔 중지 메소드
  private func stopBeaconScanning() throws {
    if beaconRegions.isEmpty {
      throw ScannerError.scannerNotActive
    }
    
    for region in beaconRegions {
      guard let locationManager = locationManager else {
        throw MonitoringError.locationManagerUnavailable
      }
      
      locationManager.stopMonitoring(for: region)
      locationManager.stopRangingBeacons(satisfying: CLBeaconIdentityConstraint(uuid: region.uuid))
    }
    beaconRegions.removeAll()
  }
  
  
  // getScanResultsForDuration 완료 처리 메소드
  private func completeScanning() {
    if let resolve = promiseResolve {
      resolve(temporaryBeacons.map { beacon in
        ["uuid": beacon.uuid.uuidString, "major": beacon.major.stringValue, "minor": beacon.minor.stringValue, "accuracy": beacon.accuracy, "rssi": beacon.rssi, "proximity": beacon.proximity.rawValue, "timestamp": NSDate().timeIntervalSince1970 * 1000]
      })
    }
    temporaryBeacons.removeAll()
    promiseResolve = nil
  }
  
  // unSupported : Beacon 은 블루투스 기능을 사용하지 않음
  @objc func requestToBluetoothEnable(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(true)
    //    reject("UNSUPPORTED", "Not implemented in iOS", nil)
  }
  
  
  // 비콘 영역을 모니터링 목록에 추가 및 스캔 시작
  @objc func startScanning(_ uuidStrings: [String], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if beaconRegions.isEmpty {
      for uuidString in uuidStrings {
        guard let uuid = UUID(uuidString: uuidString) else {
          reject("SCAN_ERROR", "Invalid UUID string: \(uuidString)", nil)
          return
        }
        
        let beaconRegion = CLBeaconRegion(uuid: uuid, identifier: uuid.uuidString)
        beaconRegions.append(beaconRegion)
        
        // 가정: startMonitoring 메소드가 오류 없이 실행되는지 확인
        do {
          try startMonitoring(beaconRegion: beaconRegion)
        } catch let error {
          reject("SCAN_ERROR", "Monitoring failed for region: \(beaconRegion.identifier)", error)
          return
        }
      }
      resolve(true)
    } else {
      reject("SCAN_ERROR", "Scanner is already started", nil);
    }
  }
  
  
  // 비콘 영역을 모니터링 목록에서 제거 및 스캔 중지
  @objc func stopScanning(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    do {
      try stopBeaconScanning()
      resolve(true)
    } catch let error {
      reject("SCAN_ERROR", "Failed to stop scanning", error)
    }
  }
  
  
  // duration을 받아 스캔하는 메소드
  @objc func getScanResultsForDuration(_ duration: Double, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    promiseResolve = resolve
    promiseReject = reject
    
    if beaconRegions.isEmpty {
      reject("SCAN_ERROR", "Scanner is not started", ScannerError.scannerNotActive)
      return
    }
    
    temporaryBeacons.removeAll()
    
    // 지정된 시간 후에 스캔 완료
    DispatchQueue.main.asyncAfter(deadline: .now() + duration) { [weak self] in
      self?.completeScanning()
    }
  }
  
  
  // 비콘 범위 지정 대리자 메소드
  func locationManager(_ manager: CLLocationManager, didRangeBeacons beacons: [CLBeacon], in region: CLBeaconRegion) {
    if promiseResolve != nil {
      for beacon in beacons {
        switch beacon.proximity {
        case .immediate, .near, .far:
          temporaryBeacons.append(beacon)
          break
        default:
          break
        }
      }
    }
    
    if beacons.count > 0 {
      for beacon in beacons {
        switch beacon.proximity {
        case .immediate, .near, .far:
          sendEvent(withBeacon: beacon)
          break
        default:
          break
        }
      }
    }
    
  }
  
  // React Native에 이벤트를 보내는 메소드
  private func sendEvent(withBeacon beacon: CLBeacon) {
    // 리스너가 등록되었는지 확인
    guard self.bridge != nil && hasListeners else {
      return
    }
    
    self.sendEvent(withName: "EVENT_BLUETOOTH_DETECTED", body: ["uuid": beacon.uuid.uuidString, "major": beacon.major.stringValue, "minor": beacon.minor.stringValue, "accuracy": beacon.accuracy, "rssi": beacon.rssi, "proximity": beacon.proximity.rawValue, "timestamp": NSDate().timeIntervalSince1970 * 1000])
    
  }
  
  // 리스너 등록 상태 변경
  override func startObserving() {
    hasListeners = true
  }
  
  override func stopObserving() {
    hasListeners = false
    //    stopBeaconScanning() // 리스너 제거 시 비콘 스캔 중지
  }
  
  // 지원하는 이벤트 명을 정의
  override func supportedEvents() -> [String]! {
    return ["EVENT_BLUETOOTH_DETECTED"]
  }
  
  // RCTEventEmitter의 메소드 오버라이드
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
