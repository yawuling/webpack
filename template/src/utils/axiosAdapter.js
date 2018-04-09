import axios from 'axios'

axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * 对axios进行拦截处理，处理异常情况，在catch里添加errorType字段，表示情况的类型（异常情况）：
 * 601 - 无网络
 * 602 - 网络不稳定导致的请求超时
 * 40* - 请求不存在或拒绝
 * 50* - 服务器出错
 */
axios.interceptors.response.use(response => {
  return response
}, error => {
  // 未知错误
  let errorType = 0
  
  if (error.message == 'Network Error') {
    // 无网络
    errorType = 601
  } else if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
    // 弱网，请求超时
    errorType = 602
  } else if (error.response && error.response.status) {
    errorType = error.response.status
  }

  return Promise.reject(errorType)
})

export default axios
