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
