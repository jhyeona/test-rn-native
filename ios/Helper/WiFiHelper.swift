//
//  WiFiHelper.swift
//  imhereV2
//
//  Created by ImDokyun on 2022/06/09.
//

import Foundation
import NetworkExtension
import SystemConfiguration.CaptiveNetwork

func scanWifiList() -> [Dictionary<String, Any>] {
  var wifiDataList :Array = [Dictionary<String, Any>]()
  var ssid: String? = ""
  var bssid: String? = ""
  
  if let interfaces = CNCopySupportedInterfaces() as NSArray? {
    for interface in interfaces {
      if let networkInfo = CNCopyCurrentNetworkInfo(interface as! CFString) as NSDictionary? {
        ssid = networkInfo[kCNNetworkInfoKeySSID as String] as? String
        bssid = networkInfo[kCNNetworkInfoKeyBSSID as String] as? String
        
        bssid = getValidBssid(bssid)
        
        let wifiData :Dictionary<String, Any> = [
          "ssid": ssid ?? "",
          "bssid": bssid ?? "",
          "rssi": 0
        ]
        
        wifiDataList.append(wifiData)
      }
    }
  }
  
  return wifiDataList
}

func scanConnectedWifiInfo() -> (String, String) {
  guard let interfaces: NSArray = CNCopySupportedInterfaces() else {
    return ("", "")
  }
  
  print("interfaces: ",interfaces)
  
  var ssid: String? = ""
  var bssid: String? = ""
  
  for interface in interfaces {
    guard let interfaceInfo: NSDictionary = CNCopyCurrentNetworkInfo(interface as! CFString) else { continue }
    ssid = interfaceInfo[kCNNetworkInfoKeySSID as String] as? String
    bssid = interfaceInfo[kCNNetworkInfoKeyBSSID as String] as? String
//    bssid = getValidBssid(bssid)
    break
  }
  
  return (ssid ?? "", bssid ?? "")
}

func getValidBssid(_ bssid:String?) -> (String?){
  guard let bssid = bssid else {
    return nil
  }
  var result :String = ""
  // 맥 어드레스 정규식 (11:1f:1a:12:34:56)
  let minRegEx = "^\\w{2}:\\w{2}:\\w{2}:\\w{2}:\\w{2}:\\w{2}$"
  // 맥 어드레스 정규식 체크
  let isCorrect :Bool = NSPredicate(format: "SELF MATCHES %@", minRegEx).evaluate(with: bssid)
  // 올바른 형식이 아니면 값 수정
  // kCNNetworkInfoKeyBSSID가 맥 어드레스를 8비트씩 잘랐을 때 앞의 4비트가 0000이면 출력해주지 않음("18:4b:d:30:b6:bc")
  // 출력해주지 않은 0000을 채워서 반환
  if !isCorrect {
    // ":"를 구분자로 하여 각 8비트(16진수로) 값을 배열로 획득
    let bssidValueList = bssid.components(separatedBy:":")
    for value in bssidValueList{
      // 분리된 값이 1자리이면 앞의 4비트가 생략된 것이므로 값을 추가
      if(value.count != 2){
        result += "0"+value+":"
      }
      else {
        result += value+":"
      }
    }
    // 마지막 8비트 끝에도 구분자(:)가 붙었으므로 앞뒤 ":"를 trim하여 반환
    result = result.trimmingCharacters(in: [":"])
  } else {
    result = bssid
  }
  return result
}
