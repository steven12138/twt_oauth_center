import { ref } from 'vue'
import { defineStore } from 'pinia'

const validateJWT = (token, online = false) => {
  if (token == null || token == undefined) return
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  const payload = JSON.parse(atob(parts[1]))

  // Check if the token is expired
  if (payload.exp) {
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime >= payload.exp) {
      return false
    }
  }

  if (online) {
    // Perform additional online checks if required
    // For example, you might want to verify the token against a database or an external service
  }

  return true
}


export const useTokenManager = defineStore('tokenManager', () => {
  const token = ref(null)
  const setToken = (newToken) => {
    token.value = newToken

    if (newToken == null) localStorage.removeItem('token')
    else localStorage.setItem('token', newToken) // Save the token to localStorage
  }
  const getToken = () => {
    if (token.value == null) {
      let storage = localStorage.getItem('token')
      if (storage === 'null') storage = null
      token.value = storage
    }
    if (!validateJWT(token.value)) {
      token.value = null
    }
    return token.value
  }

  const login = (username, password) => {
    console.log(username)
    console.log(password)
  }

  return { token, setToken, getToken, login }
})
