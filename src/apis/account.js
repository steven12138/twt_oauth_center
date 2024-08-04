import axios from './axios.js'
import { useTokenManager } from '@/stores/tokenManager.js'

export const login = async (user, pass) => {



  const data = new URLSearchParams({
    'account': user,
    'password': pass
  })

  const header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const account_info = await axios.post('/api/auth/common', data, { headers: header })
  useTokenManager().setToken(account_info.token)
  return account_info
}

export const scope = async ()=>{
  //https://api.twt.edu.cn/api/oauth/scope

  const scope = await axios.get("/api/oauth/scope")
  console.log(scope)
  return scope
}