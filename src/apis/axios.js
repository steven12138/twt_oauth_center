import axios from 'axios'
import { useTokenManager } from '@/stores/token_manager.js'
import { NotifyPlugin } from 'tdesign-vue-next'

const env = import.meta.env

const axiosInstance = axios.create({
  baseURL: env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})


// Auto Fill credential
axiosInstance.interceptors.request.use(
  (config) => {

    config.headers.Ticket = env.VITE_TICKET
    config.headers.Domain = env.VITE_DOMAIN

    // Token AutoFill
    const token = useTokenManager().getToken()
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response)
    return response
  },
  (error) => {
    if (error.code === 302) {
      window.location.href = error.response.headers.location
    }
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const err_code = response.data.error_code
    if (err_code === 0) {
      return {
        ...(typeof response.data.result === 'object' ?
          (response.data.result) :
          ({ content: response.data.result })),
        code: err_code
      }
    }
    NotifyPlugin.error({
      title: '请求异常',
      content: `${response.data.message}, 错误码: ${err_code}`
    })
    return Promise.reject({ ...response.data, code: err_code })
  },
  (error) => {
    // 对响应错误做点什么
    console.error(error)
    NotifyPlugin.error({
      title: '网络异常',
      content: `服务器发生未知错误, ${error.message}`
    })
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
