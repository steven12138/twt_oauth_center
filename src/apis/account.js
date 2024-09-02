import axios from './axios.js'
import { useTokenManager } from '@/stores/token_manager.js'

export function getUserInfo() {
  return axios.get('/api/user/single')
}


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


export const changePassword = (new_pass) => {
  return axios.put(`/api/password/person/reset?password=${new_pass}`)
}

export const send_phone_verify = (phone) => {
  return axios.post(`/api/register/phone/msg?phone=${phone}`)
}


export const register = (
  sid,
  id,
  nickname,
  email,
  phone,
  phone_verify_code,
  password
) => {
  return axios.post('/api/register', {
    userNumber: id,
    nickname: nickname,
    phone: phone,
    verifyCode: phone_verify_code,
    password: password,
    email: email,
    idNumber: id
  })
}