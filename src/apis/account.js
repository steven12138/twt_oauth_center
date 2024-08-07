import axios from './axios.js'
import { useTokenManager } from '@/stores/tokenManager.js'

export function logout() {
  useTokenManager().setToken(null)
}


export async function authorizeNewApp(client_id) {

  await axios.post('/api/oauth/authorize', {
    app_id: client_id
  })
  return true
}


export function getAppInfo(client_id) {
  return axios.get('/api/oauth/app-info', {
    params: {
      client_id: client_id
    }
  })
}

export function restoreInfo() {
  return axios.get('/api/user/single')
}


export const login = async (user, pass) => {


  const data = new URLSearchParams({
    account: user,
    password: pass
  })
  const header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const account_info = await axios.post('/api/auth/common', data, { headers: header })
  useTokenManager().setToken(account_info.token)
  return account_info
}

export const scope = () => {
  //https://api.twt.edu.cn/api/oauth/scope

  return axios.get('/api/oauth/scope')
}

export const getAuthorizeCode = (app_id, redirect_url, state, r_type = 'code') => {
  // https://api.twt.edu.cn/api/oauth/auth
  try {
    console.log(({
      response_type: r_type,
      client_id: app_id,
      redirect_url: redirect_url,
      state: state
    }))
    return axios.post('/api/oauth/auth', {
      response_type: r_type,
      client_id: app_id,
      redirect_url: redirect_url,
      state: state
    })
  } catch (e) {
    console.log(e)
  }
}