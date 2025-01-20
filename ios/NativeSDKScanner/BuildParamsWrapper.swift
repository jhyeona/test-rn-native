//
//  BuildParamsWrapper.swift
//  stickyme
//
//  Created by zoey on 1/7/25.
//

import Foundation

@objc public class BuildParamsWrapper: NSObject {
  @objc public let beaconUUID: [String]?
  @objc public let isLocationEnable: Bool
  @objc public let isBeaconEnable: Bool
  @objc public let isWifiEnable: Bool
  @objc public let beaconTTL: Int

  @objc public init(beaconUUID: [String]?,
                    isLocationEnable: Bool,
                    isBeaconEnable: Bool,
                    isWifiEnable: Bool,
                    beaconTTL: Int) {
    self.beaconUUID = beaconUUID
    self.isLocationEnable = isLocationEnable
    self.isBeaconEnable = isBeaconEnable
    self.isWifiEnable = isWifiEnable
    self.beaconTTL = beaconTTL
  }
}
