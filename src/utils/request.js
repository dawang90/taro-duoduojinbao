import Taro from '@tarojs/taro'
import { getGlobalData } from './global_data'

const CODE_SUCCESS = 200

function getStorage(key) {
  return Taro.getStorage({ key }).then(res => res.data).catch(() => '')
}


/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function fetch(options) {
  const { url, payload, method = 'GET', showToast = true } = options
  const token = await getStorage('token')
  const header = token ? { 'WX-PIN-SESSION': token, 'X-WX-3RD-Session': token } : {}
  if (method === 'POST') {
    header['content-type'] = 'application/json'
  }
  return Taro.request({
    url,
    method,
    data: {
      ...payload,
      apikey: getGlobalData('apikey')
    },
    header
  }).then(async (res) => {
    const { status_code, data } = res.data
    if (status_code !== CODE_SUCCESS) {
      return Promise.reject(res.data)
    }

    return data
  }).catch((err) => {
    const defaultMsg = err.status_code === CODE_AUTH_EXPIRED ? '登录失效' : '请求异常'
    if (showToast) {
      Taro.showToast({
        title: err && err.message || defaultMsg,
        icon: 'none'
      })
    }

    return Promise.reject({ message: defaultMsg, ...err })
  })
}
