const globalData = {
  qqAppid: '1108233859', //拼多多qq小程序appid
  pid: '10977819_147440486', //多多进宝推广为PID
  apikey: '3a7f5b0d0d8fd737' //接口apikey
}
export function setGlobalData (key, val) {
  globalData[key] = val
}
export function getGlobalData (key) {
  return globalData[key]
}