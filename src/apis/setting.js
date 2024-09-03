import axios from './axios.js'

export function updateNickname(nickname) {
  const params = new URLSearchParams()
  params.append('username', nickname)

  return axios.put('/api/user/single/username', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function updateEmail(email) {
  const params = new URLSearchParams()
  params.append('email', email)

  return axios.put('/api/user/single/email', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getVcode(phone) {
  const params = new URLSearchParams()
  params.append('phone', phone)

  return axios.post('/api/user/phone/msg', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function changePhone(code, phone) {
  const params = new URLSearchParams()
  params.append('code', code)
  params.append('phone', phone)
  return axios.put('/api/user/single/phone', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 注销账号
export function logOff() {
  return axios.post('/api/auth/logoff')
}

// 账号升级
export function upgradeOption() {
  return axios.get('/api/upgrade')
}

export function upgrade(typeId) {
  const params = new URLSearchParams()
  params.append('typeId', typeId)

  return axios.put('/api/upgrade', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}